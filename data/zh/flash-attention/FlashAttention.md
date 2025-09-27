---
title: [深度学习邪修]Flash-Attention是怎么优化计算过程的🤔
time: 20250927
keywords: [深度学习, 注意力机制, 并行计算]
preface:  传统Attention由于在计算时涉及多次访存操作造成计算效率下降，并且由于Softmax的计算机制破坏了并行计算的流畅性，导致几所过程阻塞，本文将探究Flash-Attention怎么优化这些问题的👍
---



# [深度学习邪修] Flash Attention 是怎么优化计算过程的🤔

## Attention 计算存在的问题

$$
Attention(Q,K,V) = \text{SoftMax}(\frac{Q K^T}{\sqrt{d}})V
$$

![image-20250926184519935](https://exstyty-1305069443.cos.ap-beijing.myqcloud.com//image-20250926184519935.png)

Attention的计算可以大致分为这三个步骤，首先我们必须计算$QK^T$，只有在$k$被遍历一次后，得出中间变量-相似度得分矩阵$r$的某一行，才能对该行整体作$Softmax$计算。事实是，即使有GPU并行能力的加持，要得到$r$的某一行，也需要等待$n$个时间片。
另外，计算的速度是非常快的，计算的所用时间仅仅占时间片的一小部分，但计算过程中往往伴随着频繁的开销巨大的**内存访问**，内存访问是高耗时操作，这带来了**内存读写瓶颈**

![image-20250926114049664](https://exstyty-1305069443.cos.ap-beijing.myqcloud.com//image-20250926114049664.png)

<center style="color:#C0C0C0;text-decoration:underline">得分矩阵计算时的内存操作</center>

如上图所示，在内存分配之后的计算过程中，每一个时间片都伴随着一次存储操作，直到相似度得分矩阵$r$的所有元素被计算完成，另外，后续计算中同样伴随着多次内存操作:

![image-20250926121141624](https://exstyty-1305069443.cos.ap-beijing.myqcloud.com//image-20250926121141624.png)

<center style="color:#C0C0C0;text-decoration:underline">后续的SoftMax和矩阵乘法操作，每次读取相似度矩阵的一行数据，用于计算Softmax，并参与后续的矩阵乘法</center>

## 合并计算过程

直观上减少内存操作的方式就是**不存储中间结果**（相似性矩阵）到内存中，让$Q、K、V$的计算一气呵成。假设我们有某种方法使得Softmax的计算不再阻塞并行过程：
![image-20250926213228381](https://exstyty-1305069443.cos.ap-beijing.myqcloud.com//image-20250926213228381.png)

<center style="color:#C0C0C0;text-decoration:underline">图上所示，假设有一个类似Softmax的计算，但他不依赖一整个向量的数据</center>

为了避免混淆实现与理论，先使用下图的计算过程：

![image-20250926232220169](https://exstyty-1305069443.cos.ap-beijing.myqcloud.com//image-20250926232220169.png)

如上图所示，假设我们已经拥有了一个类似Softmax但不需要一整个行向量的运算（或者干脆排除掉Sofxmax）的操作$f$，$f$不会阻塞并行计算过程，则最终结果矩阵A的行向量计算公式为:
$$
A_i = \sum_{j=1}^m{f(q_ik_j^T)v_j}
$$
经此，分段式计算被我们合并为一个流畅的计算过程，此间不再有频繁的内存访问。注意，该计算使能的前提是我们有一个函数$f$，该函数不会像Sofxmax那样阻塞并行计算过程。

## 演进Softmax

### 1. Safe-Softmax

如标题暗示，Softmax是一个暗含风险的操作，如果一个vector中含有极大值，那么在Sofxmax计算中很容易因为精度问题导致计算结果不准确，并且在后续的量化过程中易导致“饱和”现象发生。Safe-Softmax的改进思想很简单，将极大值从vector中减掉就好了:)
$$
\begin{align*}
S_{safe}{(x_i)} &= \frac{e^{x_i - max(x)}}{\sum e^{x_j - max(x)}}\\
等价于\\
 S{(x_i)} &= \frac{e^{x_i}}{\sum e^{x_j}}\\
\end{align*}
$$
如公式$S_{safe}$所示，他在数学上依旧等价于Softmax，但在代码中却不是如此。可以遇见，想进行Safe-Softmax计算就必须要找到vector中的最大元素，这意味着需要额外遍历一次vector，算上原本就有的一次遍历求和 $\sum e^{x_j}$, 我们总共要进行两次遍历。

### 2.Online-Softmax

有什么方法能够将求最大值操作和求和操作压缩在一起呢？Online-Softmax提出了一种方法：

$$
\begin{aligned}
for \ \ x_i& \ \  in \ \ Vector[0..m]:\\
1.
 \ m_0 &= x_0 = max(-inf, x_0) \\
 \ d_0 &= e^{x_0 - m_0}\\
\\
2. 
\ m_1 &= max(m_0, x_1)\\
\ d_1 &= e^{x_0 - m_1} + e^{x_1-m_1}\\
\ 	  &= e^{x_0 - m_0 + m_0 -m_1} + e^{x_1-m_1}\\
\     &= d_0 \cdot e^{m_0-m_1} + e^{x_1 - m_1}\\
\\
3.
\ m_2 &= max(m_1, x_2)\\
\ d_2 &= e^{x_0 - m_2} + e^{x_1 - m_2} + e^{x_2 - m_2}\\
\     &= e^{x_0 - m_1 + m_1 - m_2} + e^{x_1 - m_1 + m_1 -m_2} + e^{x_2 - m_2}\\
\     &= (e^{x_0 - m_1} + e^{x_1 - m_1})e^{m_1 - m_2} + e^{x_2 - m_2}\\
\     &= d_1 \cdot e^{m_1 - m_2} + e^{x_2 - m_2}\\
\\
\text{n.}
\ m_n &= max(m_{n-1},x_n)\\
\ d_n &= d_{n-1} \cdot e^{m_{n-1} - m_n} + e^{x_n - m_n}
\end{aligned}
$$
see? 上述计算过程将求和与求最大值操作合并在一个循环当中了！

> 公式中的$d_n$对应于图片中的第$m$步计算

现在我们只是通过一次遍历完成了最大值和求和操作，最大值用于计算Safe-Softmax，求和作为Safe-Softmax的分母。现在我们既没有计算vector中每个位置的softmax值，也没有计算之后其与value的乘积，此时有下列公式：
$$
\begin{aligned}
for \ \ x_i& \ \  in \ \ Vector[0..m], \ \ \ for \ \ v_i \ \  in \ \ Value[0..m]:\\
1.
 \ m_0 &= x_0 = max(-inf, x_0) \\
 \ d_0 &= e^{x_0 - m_0} = 1\\
 \ o_0 &= \frac{e^{x_0 - m_0}}{d_0} \cdot v_0
\\
2. 
\ m_1 &= max(m_0, x_1)\\
\ d_1 &= d_0 \cdot e^{m_0 - m_1} + e^{x_1 - m_1} = e^{m_0 - m_1} + e^{x_1 - m_1}\\
\ o_1 &= \frac{e^{x_0 - m_1}}{d_1} \cdot v_0 + \frac{e^{x_1 - m_1}}{d_1} \cdot v_1\\
\     &= \frac{(e^{x_0 - m_0 + m_0 - m_1})d_0}{d_0 \cdot d_1} \cdot v_0 + \frac{e^{x_1 - m_1}}{d_1} \cdot v_1\\
\     &= o_0 \cdot \frac{d_0 \ e^{m_0 - m_1}}{d_1} + \frac{e^{x_1 - m_1}}{d_1} \cdot v_1
\\
so,
\ o_j &= o_{j-1} \frac{d_{j-1} \ e^{m_{j-1} - m_j}}{d_j} + \frac{e^{x_j - m_j}}{d_j} \cdot v_j
\end{aligned}
$$
当$j == m$时，结果矩阵$A$中的单个元素被计算完成。



总结一下，我们为了减少内存访问，拒绝了存储中间结果-相似度矩阵，转而使用单步计算得到的单个元素$r_{i,j}$进行后续计算；后续计算中，由于Softmax需要$r_i$这样多个元素的向量用于计算分母，这与我们使用单个元素计算（不存储中间结果）的原则相悖，所以我们使用了$\text{Online-Softmax} * value$算法，在单次遍历结束后就能计算出结果矩阵中的一个元素。理论上实现了少量内存访问的并行softmax计算。👍
