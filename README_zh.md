[English](README.md) | 中文

#  Deno-Fresh 无服务博客应用Demo

可以部署在无服务器应用平台上的博客应用，基于Deno-Fresh， 查看我的[博客主页](https://freshblogs.exstyty.deno.net)

## 功能

- 通过嵌入静态页面来实现博客阅读（静态页面需要由Markdown编辑器如Typora、VSCode导出）
- 部署时预加载资源-首次部署时会生成博客索引，提高检索性能，减少数据流量
- 博客文章可搜索

## 使用方式

1.  你应当在Markdown博客文章开头嵌入Front-Matter元数据内容，其格式示例如下：

   ```markdown
   ---
   title: 天空为什么是蓝色的🤯
   time: 20251125
   keywords: [常识, 自然科学, 宇宙, 物理]
   preface: 本文从科学的角度解释了为什么地球的天空是湛蓝色的，它和太阳光波长、瑞利散射具有直接关系。。。
   ---
   ```
   
2. 在导出为HTML时，你应当在Markdown编辑器中设置导出事项，将Front-Matter-Text嵌入在`html-head`中的`meta`标签中，常见的Markdown编辑器如Typora都提供了类似的功能。

   

3. 这些博客html应存放在`./data/{language}/{blog_name}/{blog_name.html}`位置，如果你没有使用图床服务，可以在`{blog_name}`文件夹中存储你的图片。

   

4. 运行博客应用前，请运行
   ```bash
   deno task build
   ```

   这将会执行在`deno.json`中配置的命令:

   ```json
   {
       ...
       "tasks": {
           "build": "deno run -A dev.ts build && deno run -A build.ts zh",
       },
       ...
   }
   ```

   在`build.ts`中，将会为当前的所有博客生成目录索引。

   

5.  运行命令以运行博客应用:
   ```bash
   deno run -A main.ts
   ```

   ## 部署方式

   推荐将该应用免费部署在Deno官方的[Deno Deploy](https://docs.deno.com/services/)当中，无需任何额外的工作流配置，链接到Github仓库中即可工作
