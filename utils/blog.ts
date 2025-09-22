import { walk } from "$std/fs/walk.ts";
import { delay } from "$std/async/delay.ts";
import { BlogDesc } from "../interfaces/blog_desc.ts";

/**
 * 获得对某一个语言的博客的目录，它应该是一个`manifest.json`
 * 此`manifest.json`应当在应用的`build`阶段被生成
 * 这是一个服务端函数，不能在组件中被调用
 */
export async function get_blogs_desc(
    lang: "zh" | "cn" = "zh"
): Promise<BlogDesc[]> {
    const path = `${Deno.cwd()}/data/${lang}`;
    const blog_des = [];
    const manifest = await Deno.readTextFile(`${path}/manifest.json`);
    const manifest_json:BlogDesc[] = JSON.parse(manifest);
    for (const desc of manifest_json) {
        blog_des.push(desc);
    }
    return blog_des;
}

export async function get_blog_source(
    blog_title: string,
    lang: "zh" | "cn" = "zh"
) {
    const path = `${Deno.cwd()}/data/${lang}/`;
    for await (const entry of walk(path, {
        maxDepth: 2,
        includeFiles: true,
        exts: [".html"],
    })) {
        if (entry.name === `${blog_title}.html`) {
            return await Deno.readTextFile(entry.path);
        }
    }
    return null;
}

Deno.test("get_blogs_data", async () => {
    const dirs = await get_blogs_desc();
    await delay(500);
    console.log(dirs);
});

Deno.test("get_blog_source", async () => {
    const dirs = await get_blog_source(
        "[Rust]Anyhow库是如何利用类型擦除来实现高性能的任意类型的错误处理的🤯"
    );
    await delay(500);
    console.log(dirs);
});
