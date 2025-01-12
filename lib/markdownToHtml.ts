import remarkParse from "remark-parse";
import { rehype } from "rehype";
import rehypePrism from "rehype-prism";
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify';
import { unified } from "unified";

// Manual Prism JS Module Load
import "prismjs/prism.js";
// import "prismjs/themes/prism-twilight.css";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js";
import "prismjs/plugins/show-language/prism-show-language.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrism, { plugins: [
      "line-numbers",
      "copy-to-clipboard",
      "show-language"
    ] })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}