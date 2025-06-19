// @ts-check
import { defineConfig } from 'astro/config';


// https://astro.build/config
export default defineConfig({
    site: 'https://will-pettifer.github.io',
    base: '/site',
    markdown: {
        shikiConfig: {
            theme: 'github-dark'
        }
    },
    experimental: {
        responsiveImages: true,
    }
});
