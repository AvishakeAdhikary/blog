import { mkdir, readdir, copyFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const root = process.cwd();

async function pathExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = join(src, entry.name);
    const d = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d);
    } else if (entry.isFile()) {
      await mkdir(dirname(d), { recursive: true });
      await copyFile(s, d);
    }
  }
}

async function copyPostAssets() {
  const postsDir = join(root, 'content', 'posts');
  if (!(await pathExists(postsDir))) return;
  const slugs = await readdir(postsDir, { withFileTypes: true });
  let count = 0;
  for (const entry of slugs) {
    if (!entry.isDirectory()) continue;
    const assetsSrc = join(postsDir, entry.name, 'assets');
    if (!(await pathExists(assetsSrc))) continue;
    const assetsDest = join(root, 'public', 'posts', entry.name, 'assets');
    await copyDir(assetsSrc, assetsDest);
    count += 1;
  }
  console.log(`[prebuild] copied assets for ${count} post(s)`);
}

async function main() {
  await import('./build-search-index.mjs');
  await import('./build-rss.mjs');
  await import('./build-sitemap.mjs');
  // small delay so the imported scripts' top-level promises settle before we copy
  await new Promise((r) => setTimeout(r, 50));
  await copyPostAssets();
}

main().catch((e) => {
  console.error('[prebuild] failed:', e);
  process.exit(1);
});
