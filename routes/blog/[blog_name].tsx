// routes/blog/[blog_name].tsx
import { Context } from "fresh";
import { get_blog_source } from "../../utils/blog.ts";
import { Head } from "fresh/runtime";
// import { DOMParser } from "jsr:@b-fuze/deno-dom/wasm-noinit"; //似乎要在构建时使用它作为过渡?
// import { DOMParser } from "jsr:@b-fuze/deno-dom";
// deno-lint-ignore no-unversioned-import
import { DOMParser } from "jsr:@b-fuze/deno-dom/native"

import { BlogDesc } from "../../interfaces/blog_desc.ts";

export const handler = async (ctx: Context<BlogDesc>) => {
  const title = decodeURIComponent(ctx.params.blog_name);
  const data = await get_blog_source(title) ?? "";

  return { title: title, data: data };
};

export default function BlogPage(
  { title, data }: { title: string; data: string },
) {
  const doc = new DOMParser().parseFromString(data, "text/html");
  const head_styles = Array.from(doc.querySelectorAll("head style")).map((
    style,
  ) => style.outerHTML);

  const head_meta = Array.from(doc.querySelectorAll("head meta")).map((meta) =>
    meta.outerHTML
  );
  const head_links = Array.from(doc.querySelectorAll("head link")).map((link) =>
    link.outerHTML
  );

  const bodyContent = doc.querySelector("body")?.innerHTML || "";

  return (
    <>
      <Head>
        <title>{title}</title>
        {head_meta.map((meta, index) => (
          // deno-lint-ignore react-no-danger
          <div key={index} dangerouslySetInnerHTML={{ __html: meta }} />
        ))}
        {head_links.map((link, index) => (
          // deno-lint-ignore react-no-danger
          <div key={index} dangerouslySetInnerHTML={{ __html: link }} />
        ))}
        {head_styles.map((style, index) => (
          // deno-lint-ignore react-no-danger
          <div key={index} dangerouslySetInnerHTML={{ __html: style }} />
        ))}
      </Head>

      <article
        class=" text-white lg:max-w-screen-lg lg:items-center lg:justify-center md:max-w-screen-lg mx-auto flex flex-col "
        // deno-lint-ignore react-no-danger
        dangerouslySetInnerHTML={{ __html: bodyContent }}
      />
    </>
  );
}
