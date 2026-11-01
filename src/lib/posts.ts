import { getCollection } from 'astro:content'

/** Posts, newest first. Drafts show up in `astro dev` only. */
export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft)
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}
