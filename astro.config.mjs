// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Code Club',
      customCss: [
        './src/styles/global.css',
      ],
      social: [
        { icon: 'github', href: 'https://github.com/allscripty/Programmer', label: 'GitHub' },
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