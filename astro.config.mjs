// @ts-check

import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://yuchuntsao.github.io',
  integrations: [mdx(), sitemap()],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['100 900'],
      subsets: ['latin'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
