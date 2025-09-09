// routes/blog/[blog_name].tsx
import { FreshContext, PageProps } from "$fresh/server.ts";
import { get_blog_source } from "../../utils/blog.ts";
import { Head } from "$fresh/runtime.ts";
import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";

export const handler = async (_req: Request, ctx: FreshContext) => {
    const title = decodeURIComponent(ctx.params.blog_name);
    const data = await get_blog_source(title);
    return ctx.render({ title, data });
};

export default function BlogPage(
    props: PageProps<{ title: string; data: string }>
) {
    const doc = new DOMParser().parseFromString(props.data.data, "text/html");
    const head_styles = Array.from(doc.querySelectorAll("head style")).map(
        (style) => style.outerHTML
    );

    const head_meta = Array.from(doc.querySelectorAll("head meta")).map(
        (meta) => meta.outerHTML
    );
    const head_links = Array.from(doc.querySelectorAll("head link")).map(
        (link) => link.outerHTML
    );

    const bodyContent = doc.querySelector("body")?.innerHTML || "";

    return (
        <>
            <Head>
                <title>{props.data.title}</title>
                {head_meta.map((meta, index) => (
                    <div
                        key={index}
                        dangerouslySetInnerHTML={{ __html: meta }}
                    />
                ))}
                {head_links.map((link, index) => (
                    <div
                        key={index}
                        dangerouslySetInnerHTML={{ __html: link }}
                    />
                ))}
                {head_styles.map((style, index) => (
                    <div
                        key={index}
                        dangerouslySetInnerHTML={{ __html: style }}
                    />
                ))}
            </Head>

            <article
                class="text-white max-w-screen-lg mx-auto flex flex-col items-center justify-center"
                dangerouslySetInnerHTML={{ __html: bodyContent }}
            />
        </>
    );
}
