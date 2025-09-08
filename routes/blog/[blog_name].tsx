// routes/blog/[blog_name].tsx
import { FreshContext, PageProps } from "$fresh/server.ts";
import markdownit from "markdown-it";
import { get_blog_source } from "../../utils/blog.ts";
import { Head } from "$fresh/runtime.ts";
import { CSS } from "@deno/gfm";

const md = markdownit();

export const handler = async (_req: Request, ctx: FreshContext) => {
    const title = decodeURIComponent(ctx.params.blog_name);
    const origin_data = await get_blog_source(title);
    const body = md.render(origin_data);
    return ctx.render({ title, body });
};

export default function BlogPage(
    props: PageProps<{ title: string; body: string }>
) {
    const body = props.data.body;
    return (
        <html class="mx-auto max-w-screen-md flex flex-col items-center min-h-screen">
            <Head>
                <style dangerouslySetInnerHTML={{ __html: CSS }} />
            </Head>
            <article
                class="markdown-body"
                dangerouslySetInnerHTML={{
                    __html: body,
                }}></article>
        </html>
    );
}
