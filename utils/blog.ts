import { walk, walkSync } from "$std/fs/walk.ts";
import { delay } from "$std/async/delay.ts";
import { BlogDesc } from "../interfaces/blog_desc.ts";

/**
 * 获得对应语言文件夹内的所有笔记的描述文件，它应该是一个`.json`
 * 这是一个服务端函数，不能在组件中被调用
 *
 */
export async function get_blogs_desc(
    lang: "zh" | "cn" = "zh"
): Promise<BlogDesc[]> {
    const path = `${Deno.cwd()}/data/${lang}`;
    const json_files = [];
    const blog_des = [];
    for await (const entry of walk(path, {
        maxDepth: 2,
        includeFiles: true,
        exts: [".json"],
    })) {
        json_files.push(entry);
    }
    for (const jf of json_files) {
        const text_fmt = await Deno.readTextFile(jf.path);
        const json_fmt: BlogDesc = JSON.parse(text_fmt);
        blog_des.push(json_fmt);
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
        exts: [".md"],
    })) {
        if (entry.name === `${blog_title}.md`) {
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
        "利用类型擦除和来实现高性能的任意类型的错误处理"
    );
    await delay(500);
    console.log(dirs);
});
