import { BlogDesc } from "../interfaces/blog_desc.ts";

export default function BlogDescCard({ desc }: { desc: BlogDesc }) {
    return (
        <div class="mb-16">
            <article>
                <a
                    class="mb-1 card-title link link-hover text-2xl "
                    href={`/blog/${desc.title}`}>
                    {desc.title}
                </a>

                <p class="mb-2">
                    {desc.keywords.map((k) => (
                        <span class="text-sm mr-3 inline-grid border-x border-white px-2">
                            {k}
                        </span>
                    ))}
                </p>

                <p>{desc.preface}</p>
            </article>
        </div>
    );
}
