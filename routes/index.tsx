import { Context } from "fresh";
import { BlogDesc } from "../interfaces/blog_desc.ts";
import SearchBar from "../islands/search_bar.tsx";
import { get_blogs_desc } from "../utils/blog.ts";

let dataLoadPromise: Promise<BlogDesc[]> | null = null;

export const handler = {
  async GET(ctx: Context<BlogDesc[]>) {
    if (!dataLoadPromise) {
      dataLoadPromise = get_blogs_desc();
    }
    const blogs: BlogDesc[] = await dataLoadPromise;
    return ctx.render(<Home data={blogs} />);
  },
};

export default function Home({ data }: { data: BlogDesc[] }) {
  return (
    <div class="px-4 mx-auto min-h-screen bg-[#000000] text-white">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6 shadow-inner shadow-black "
          src="/logo.jpg"
          width="1920"
          height="1080"
          alt="the Fresh logo: a sliced lemon dripping with juice"
          style={{
            maskImage: "linear-gradient(to top, black 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 80%, transparent 100%)",
          }}
        />
        <h1 class="text-4xl font-black font-sans tracking-widest">
          Exstyty的博客
        </h1>
        <section>
          <SearchBar blogs={data} />
        </section>
      </div>
    </div>
  );
}
