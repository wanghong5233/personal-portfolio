import rehypeMermaid from 'rehype-mermaid';
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
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: 'img-svg',
          mermaidConfig: {
            theme: 'base',
            flowchart: { useMaxWidth: false },
            sequence: { useMaxWidth: false },
            er: { useMaxWidth: false },
            state: { useMaxWidth: false },
            themeVariables: {
              background: '#fffdf8',
              primaryColor: '#e8efff',
              primaryTextColor: '#172033',
              primaryBorderColor: '#2557d6',
              lineColor: '#526173',
              secondaryColor: '#f3efe7',
              tertiaryColor: '#fffdf8',
              fontFamily: 'ui-sans-serif, system-ui, "Noto Sans SC", "PingFang SC", sans-serif',
            },
          },
        },
      ],
    ],
  },
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
