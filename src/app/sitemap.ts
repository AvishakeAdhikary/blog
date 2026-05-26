import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { getAllPostSummaries, getAllTags } from '@/lib/posts';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.siteUrl;
  const posts = await getAllPostSummaries();
  const tags = await getAllTags();

  const now = new Date();

  const root: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/posts/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/tags/`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 }
  ];

  for (const p of posts) {
    root.push({
      url: `${base}/posts/${p.slug}/`,
      lastModified: p.updated ? new Date(p.updated) : new Date(p.date),
      changeFrequency: 'monthly',
      priority: 0.8
    });
  }
  for (const t of tags) {
    root.push({
      url: `${base}/tags/${t.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.4
    });
  }
  return root;
}
