import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://wh5233.me',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  integrations: [mdx(), sitemap()],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
