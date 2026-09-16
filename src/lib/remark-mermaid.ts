import { visit } from 'unist-util-visit';
import type { Root, Code, Html } from 'mdast';
import type { Plugin } from 'unified';

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Converts ```mermaid fenced code blocks into a plain `div` (with a raw-text
 * fallback `<pre>`) *before* remark-rehype/rehype-pretty-code run, so Shiki
 * never sees them as `pre > code` and leaves them alone. Client-side
 * enhancement (src/lib/dom/mermaid-render.ts) renders the SVG into this div.
 */
export const remarkMermaid: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang !== 'mermaid' || !parent || index === null || index === undefined) return;
      const escaped = escapeHtml(node.value);
      const html: Html = {
        type: 'html',
        value:
          `<div class="mermaid-diagram not-prose" data-mermaid-source="${escaped}">` +
          `<pre class="mermaid-fallback">${escaped}</pre>` +
          `</div>`
      };
      parent.children[index] = html;
    });
  };
};
