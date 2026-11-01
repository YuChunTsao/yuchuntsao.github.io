import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const posts = defineCollection({
  // Load Markdown and MDX files in the `src/content/posts/` directory.
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    // Transform string to Date object
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
  }),
})

export const collections = { posts }
