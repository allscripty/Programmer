// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://codeclub.avayashrestha.workers.dev',
  output: 'server',
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    starlight({
      title: 'Code Club',
      favicon: '/favicon_io/favicon.ico',
      customCss: [
        './src/styles/global.css',
      ],
      components: {
        SocialIcons: './src/components/SocialWithAuth.astro',
      },
      social: [
        { icon: 'github', href: 'https://github.com/allscripty/Programmer', label: 'GitHub' },
      ],
      head: [
        { tag: 'link', attrs: { rel: 'icon', type: 'image/x-icon', href: '/favicon_io/favicon.ico' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon_io/favicon-32x32.png' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon_io/favicon-16x16.png' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon_io/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'manifest', href: '/favicon_io/site.webmanifest' } },
      ],
      // Adds a nice "Edit this page" link to the bottom of all notes
      editLink: {
        baseUrl: 'https://github.com/allscripty/Programmer/edit/main/',
      },
      sidebar: [
        {
          label: 'C Programming',
          autogenerate: { directory: 'c-programming' },
        },
        {
          label: 'HTML Basics',
          autogenerate: { directory: 'html' },
        },
        {
          label: 'CSS Styling',
          autogenerate: { directory: 'css' },
        },
        {
          label: 'JavaScript Projects',
          autogenerate: { directory: 'js' },
        },
        {
          label: 'PHP Scripts',
          autogenerate: { directory: 'php' },
        },
      ],
    }),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});