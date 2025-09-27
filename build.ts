// deno run -A build.ts {"en" | "zh"}
import { walk } from "$std/fs/walk.ts";
// deno-lint-ignore no-unversioned-import
import { DOMParser } from "jsr:@b-fuze/deno-dom/native"
import { BlogDesc } from "./interfaces/blog_desc.ts";

const lang = Deno.args[0] ?? "zh";
const root = `${Deno.cwd()}/data/${lang}`;
// type MetaMap = Record<"title" | "time" | "keywords" | "preface", Array<string> | string | number>;

/**
 *  解析html，取得manifest
 */
function parse_head_meta(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const title_meta = doc.querySelector("head title");

  const metas = Array.from(doc.querySelectorAll("head meta"));
  // const meta_map: MetaMap = {
  //     title: "",
  //     time: 0,
  //     keywords: [],
  //     preface: "",
  // };
  const meta_map: BlogDesc = {
    title: "",
    time: 0,
    keywords: [],
    preface: "",
  };

  meta_map.title = title_meta?.textContent?.trim() ?? "";

  for (const m of metas) {
    const name = m.getAttribute("name") ?? "";
    const content = m.getAttribute("content") ?? "";
    if (!name || !content) continue;
    // 处理标签逻辑
    if (name.toLowerCase() === "keywords") {
      meta_map.keywords = content
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean); // "": 空string为false，过滤掉
    } else if (name === "time") {
      const n = Number(content);
      if (!Number.isNaN(n)) meta_map.time = n;
    } else if (name === "preface") {
      meta_map[name] = content;
    }
  }
  return meta_map;
}

// 获取所有html博客文件的manifest
const items: BlogDesc[] = [];
for await (const entry of walk(root, { includeFiles: true, exts: [".html"] })) {
  const html = await Deno.readTextFile(entry.path);
  const meta = parse_head_meta(html);
  items.push(meta);
}

// 生成json格式的manifest
const manifestPath = `${root}/manifest.json`;
await Deno.writeTextFile(manifestPath, JSON.stringify(items, null, 2));
console.log(`Manifest written: ${manifestPath} (${items.length} posts)`);
