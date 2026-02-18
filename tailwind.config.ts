import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config & { daisyui?: any } = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [daisyui],
    daisyui: {
        themes: [
            {
                gadgetify: {
                    primary: "#3b82f6",
                    "primary-content": "#ffffff",
                    secondary: "#8b5cf6",
                    "secondary-content": "#ffffff",
                    accent: "#06b6d4",
                    "accent-content": "#ffffff",
                    neutral: "#1e293b",
                    "neutral-content": "#f1f5f9",
                    "base-100": "#ffffff",
                    "base-200": "#f8fafc",
                    "base-300": "#e2e8f0",
                    "base-content": "#0f172a",
                    info: "#0ea5e9",
                    success: "#10b981",
                    warning: "#f59e0b",
                    error: "#ef4444",
                },
            },
        ],
    },
};

export default config;
