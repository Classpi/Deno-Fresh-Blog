// islands/search_bar.tsx
import { BlogDesc } from "../interfaces/blog_desc.ts";
import BlogDescCard from "./blog_desc_card.tsx";
import { useSignal } from "@preact/signals";

interface Props {
  blogs: BlogDesc[];
}

export default function SearchBar({ blogs }: Props) {
  const query = useSignal("");

  const filteredBlogs = blogs.filter((blog) => {
    if (!query.value.trim()) return true;
    const lowerQuery = query.value.toLowerCase();
    if (blog.title.toLowerCase().includes(lowerQuery)) return true;
    if (blog.preface.toLowerCase().includes(lowerQuery)) return true;
    if (
      blog.keywords.some((keyword) =>
        keyword.toLowerCase().includes(lowerQuery)
      )
    ) return true;
    return false;
  }).sort((a, b) => b.time - a.time);

  return (
    <section class="mt-5">
      {/* SearchBar */}
      <div class="flex items-center justify-center h-20">
        <label class="input input-ghost">
          <svg
            class="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            class="grow"
            placeholder="Search"
            value={query.value}
            onInput={(e) => (query.value = e.currentTarget.value)}
          />
        </label>
      </div>

      {/* {博客列表} */}
      <div class="space-y-6">
        {filteredBlogs.length > 0
          ? (
            filteredBlogs.map((desc) => (
              <BlogDescCard desc={desc} key={desc.title} />
            ))
          )
          : <p class="text-center text-gray-400">没有找到匹配的博客</p>}
      </div>
    </section>
  );
}
