import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { Feed } from 'feed';

const root = process.cwd();

async function readJson(p) {
  return JSON.parse(await readFile(p, 'utf8'));
}

async function main() {
  const site = await readJson(join(root, 'content', 'site.json'));
  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.siteUrl,
    link: site.siteUrl,
    language: site.locale || 'en',
    copyright: `© ${new Date().getFullYear()} ${site.author}`,
    updated: new Date(),
    feedLinks: { rss2: `${site.siteUrl}/feed.xml` },
    author: { name: site.author, link: site.authorUrl }
  });

  const files = await fg('content/posts/*/index.md', { cwd: root, absolute: true });
  const items = [];
  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const parsed = matter(raw);
    if (parsed.data.draft) continue;
    const slug = file.split(/[\\/]/).slice(-2, -1)[0];
    items.push({ slug, fm: parsed.data, body: parsed.content });
  }
  items.sort((a, b) => new Date(b.fm.date).getTime() - new Date(a.fm.date).getTime());

  for (const it of items) {
    const url = `${site.siteUrl}/posts/${it.slug}/`;
    feed.addItem({
      id: url,
      link: url,
      title: it.fm.title,
      description: it.fm.description || '',
      date: new Date(it.fm.date),
      author: [{ name: site.author, link: site.authorUrl }],
      category: (it.fm.tags || []).map((t) => ({ name: t }))
    });
  }

  const out = join(root, 'public', 'feed.xml');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, feed.rss2(), 'utf8');
  console.log(`[rss] wrote ${items.length} items → public/feed.xml`);
}

main().catch((e) => {
  console.error('[rss] failed:', e);
  process.exit(1);
});
