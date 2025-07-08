// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from "remark-math";
import rehypeMathjax from 'rehype-mathjax';

// https://astro.build/config
export default defineConfig({
    site: 'https://will-pettifer.github.io',
    base: '/site',
    markdown: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeMathjax],
        syntaxHighlight: 'shiki',
        shikiConfig: {
            theme: 'github-dark'
        }
    }
});
