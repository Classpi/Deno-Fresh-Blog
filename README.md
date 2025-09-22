English | [中文](README_zh.md)

# Deno-Fresh Serverless Blog Application Demo

A blog application deployable on serverless platforms, built with Deno-Fresh. See [my own blog](https://freshblogs.exstyty.deno.net)

## Features

- Blog reading experience by embedding static HTML pages (static pages should be exported from Markdown editors like Typora or VSCode)
- Preloading resources during deployment—generates a blog index upon initial deployment to improve retrieval performance and reduce data traffic
- Search functionality for blog posts

## How to Use

1. You should include Front-Matter metadata at the beginning of your Markdown blog posts. The format is as follows: 

   ```
   --- 
   title: Why Is the Sky Blue? 🤯 
   time: 20251125 
   keywords: [common sense, natural science, universe, physics] 
   preface: This article explains from a scientific perspective why the Earth's sky appears blue, relating directly to sunlight wavelengths and Rayleigh scattering... 
   ---
   ```

   

2. When exporting to HTML, configure your Markdown editor to embed the Front-Matter text within `meta` tags in the `html-head`. Common Markdown editors like Typora offer such functionality.

3. These blog HTML files should be stored in the location: `./data/{language}/{blog_name}/{blog_name.html}`. If you are not using an image hosting service, you can store your images in the `{blog_name}`folder.

4. Before running the blog application, execute:

   ```bash
   deno task build
   ```

   This will run the command configured in `deno.json`: 

   ```json
   {
       ...
       "tasks": {
           "build": "deno run -A dev.ts build && deno run -A build.ts zh",
       },
       ...
   }
   ```

   

   In `build.ts`, a directory index will be generated for all current blog posts.

5. Run the following command to start the blog application: 

   ```bash
   deno run -A main.ts
   ```

## Deployment

It is recommended to deploy this application for free on Deno's official [Deno Deploy](https://docs.deno.com/services/). No additional workflow configuration is needed—simply link to your GitHub repository, and it will work seamlessly.

