import 'server-only';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { basePath } from './site';
import type { TocEntry } from './types';

interface RenderOptions {
  slug?: string;
}

function rewriteAssetPaths(raw: string, slug?: string): string {
  if (!slug) return raw;
  const prefix = `${basePath}/posts/${slug}/assets/`;
  return raw.replace(/(\]\(|src=["'])\.\/assets\/([^)"']+)/g, (_m, p1: string, p2: string) => {
    return `${p1}${prefix}${p2}`;
  });
}

function tocExtractor(toc: TocEntry[]) {
  return () => (tree: unknown) => {
    visit(tree as never, 'element', (node: { tagName?: string; properties?: { id?: string }; children?: Array<{ type: string; value?: string; children?: Array<{ type: string; value?: string }> }> }) => {
      if (!node.tagName) return;
      const match = /^h([1-6])$/.exec(node.tagName);
      if (!match) return;
      const depth = Number(match[1]);
      if (depth < 2 || depth > 4) return;
      const id = node.properties?.id;
      if (!id) return;
      const text = extractText(node);
      toc.push({ id, text, depth });
    });
  };
}

function extractText(node: { children?: Array<{ type: string; value?: string; children?: Array<{ type: string; value?: string }> }> }): string {
  if (!node.children) return '';
  let out = '';
  for (const child of node.children) {
    if (child.type === 'text' && typeof child.value === 'string') out += child.value;
    else if (child.children) out += extractText(child as never);
  }
  return out;
}

export async function renderMarkdown(
  raw: string,
  options: RenderOptions = {}
): Promise<{ html: string; toc: TocEntry[] }> {
  const rewritten = rewriteAssetPaths(raw, options.slug);
  const toc: TocEntry[] = [];

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: ['anchor'] }
    })
    .use(rehypeKatex)
    .use(rehypePrettyCode, {
      theme: { dark: 'github-dark-dimmed', light: 'github-light' },
      keepBackground: false,
      defaultLang: 'plaintext'
    })
    .use(tocExtractor(toc))
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(rewritten);

  return { html: String(file), toc };
}

export function stripMarkdown(raw: string): string {
  return raw
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
