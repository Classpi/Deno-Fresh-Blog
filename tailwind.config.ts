import { type Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
    content: ["{routes,islands,components}/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Noto Sans SC"],
            },
        },
    },
    plugins: [daisyui],
    disyui: {
        themes: ["light", "dark", "cupcake"],
        defaultTheme: "dark", // 设置默认主题
    },
} satisfies Config;
