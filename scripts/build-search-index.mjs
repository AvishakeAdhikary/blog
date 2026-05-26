import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';

const root = process.cwd();
const POSTS_GLOB = 'content/posts/*/index.md';

function strip(md) {
  return md
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const files = await fg(POSTS_GLOB, { cwd: root, absolute: true });
  const entries = [];
  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const parsed = matter(raw);
    const slug = file.split(/[\\/]/).slice(-2, -1)[0];
    if (parsed.data.draft) continue;
    const stripped = strip(parsed.content);
    entries.push({
      slug,
      title: parsed.data.title || slug,
      description: parsed.data.description || '',
      date: parsed.data.date || '',
      tags: parsed.data.tags || [],
      excerpt: stripped.slice(0, 200).trim()
    });
  }
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const out = join(root, 'public', 'search-index.json');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify(entries, null, 2), 'utf8');
  console.log(`[search] wrote ${entries.length} entries → public/search-index.json`);
}

main().catch((e) => {
  console.error('[search] failed:', e);
  process.exit(1);
});
