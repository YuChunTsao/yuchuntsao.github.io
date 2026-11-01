import { getCollection } from 'astro:content'
import { slug } from 'github-slugger'

/** Posts, newest first. Drafts show up in `astro dev` only. */
export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft)
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

/** URL segment for a tag, same as the old site: `Vector Tiles` → `vector-tiles`. */
export function tagSlug(tag: string) {
  return slug(tag)
}

/** Tag slugs with their post counts, most used first. */
export async function getTags() {
  const counts = new Map<string, number>()
  for (const post of await getPosts()) {
    for (const tag of post.data.tags) {
      const s = tagSlug(tag)
      counts.set(s, (counts.get(s) ?? 0) + 1)
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1])
}
