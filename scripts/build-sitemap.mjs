import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';

const root = process.cwd();

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  const site = JSON.parse(await readFile(join(root, 'content', 'site.json'), 'utf8'));
  const base = site.siteUrl.replace(/\/$/, '');
  const files = await fg('content/posts/*/index.md', { cwd: root, absolute: true });
  const posts = [];
  const tagSet = new Set();
  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const parsed = matter(raw);
    if (parsed.data.draft) continue;
    const slug = file.split(/[\\/]/).slice(-2, -1)[0];
    posts.push({ slug, date: parsed.data.date, updated: parsed.data.updated });
    for (const t of parsed.data.tags || []) tagSet.add(slugify(t));
  }

  const now = new Date().toISOString();
  const urls = [
    { loc: `${base}/`, changefreq: 'weekly', priority: '1.0', lastmod: now },
    { loc: `${base}/posts/`, changefreq: 'weekly', priority: '0.9', lastmod: now },
    { loc: `${base}/tags/`, changefreq: 'weekly', priority: '0.6', lastmod: now },
    { loc: `${base}/about/`, changefreq: 'monthly', priority: '0.5', lastmod: now }
  ];
  for (const p of posts) {
    const lm = p.updated || p.date ? new Date(p.updated || p.date).toISOString() : now;
    urls.push({ loc: `${base}/posts/${p.slug}/`, changefreq: 'monthly', priority: '0.8', lastmod: lm });
  }
  for (const t of tagSet) {
    urls.push({ loc: `${base}/tags/${t}/`, changefreq: 'weekly', priority: '0.4', lastmod: now });
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
      )
      .join('\n') +
    `\n</urlset>\n`;

  const out = join(root, 'public', 'sitemap.xml');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, xml, 'utf8');
  console.log(`[sitemap] wrote ${urls.length} urls → public/sitemap.xml`);
}

main().catch((e) => {
  console.error('[sitemap] failed:', e);
  process.exit(1);
});
