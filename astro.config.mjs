// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from "remark-math";
import rehypeKatex from 'rehype-katex';

export default defineConfig({
    site: 'https://will-pettifer.github.io',
    base: '/site',
    markdown: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        syntaxHighlight: 'shiki',
        shikiConfig: {
            theme: 'catppuccin-frappe',
        },
    },
});