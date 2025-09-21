import { BlogDesc } from "../interfaces/blog_desc.ts";

export default function BlogDescCard({ desc }: { desc: BlogDesc }) {
    return (
        <div class="mb-16">
            <article>
                <div class="flex items-center mb-1">
                    <a
                        class="mb-1 card-title link link-hover text-2xl flex-1"
                        href={`/blog/${desc.title}`}>
                        {desc.title}
                    </a>
                    <span class="text-xs text-gray-200 align-middle">
                        {desc.time}
                    </span>
                </div>

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
