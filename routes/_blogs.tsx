import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { BlogDesc } from "../interfaces/blog_desc.ts";
import { get_blogs_desc } from "../utils/blog.ts";

let dataLoadPromise: Promise<BlogDesc[]> | null = null;

export const handler: Handlers = {
    async GET(_req: Request, ctx: FreshContext) {
        if (!dataLoadPromise) {
            dataLoadPromise = get_blogs_desc();
            console.log("被执行");
        }

        const blogs = await dataLoadPromise;
        const resp = await ctx.render(blogs);
        console.log(blogs[0].keywords, blogs[0].title);
        return resp;
    },
};

export default function BlogList(props: PageProps<Array<BlogDesc>>) {
    return (
        <figure>
            <figure class="mt-7 space-y-10">
                <ul>
                    {props.data.map((blg) => (
                        <li>
                            {blg.title} | {blg.keywords.join("  ")} |
                            {blg.preface}
                        </li>
                    ))}
                </ul>
            </figure>
        </figure>
    );
}
