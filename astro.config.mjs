// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    starlight({
      title: 'Code Club',
      customCss: [
        './src/styles/global.css',
      ],
      social: [
        { icon: 'github', href: 'https://github.com/allscripty/programs', label: 'GitHub' },
      ],
      // Adds a nice "Edit this page" link to the bottom of all notes
      editLink: {
        baseUrl: 'https://github.com/allscripty/college-code-hub/edit/main/',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/guides/intro/' },
            { label: 'How to Contribute', link: '/guides/contribute/' },
          ],
        },
        {
          label: 'C Programming',
          autogenerate: { directory: 'c-programming' },
        },
        {
          label: 'Web Dev (HTML/CSS)',
          autogenerate: { directory: 'html' },
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