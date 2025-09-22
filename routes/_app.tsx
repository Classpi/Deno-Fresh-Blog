import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
    return (
        // 隐藏滚动条，防止宽度变化导致的页面抖动
        <html class="overflow-y-scroll no-scrollbar">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>fresh-blog</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            {/* 默认daisyUI 黑暗主题 */}
            <body data-theme="dark" class="">
                <Component />
            </body>
        </html>
    );
}
