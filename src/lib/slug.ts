import GithubSlugger from 'github-slugger';

const slugger = new GithubSlugger();

export function slugify(input: string): string {
  slugger.reset();
  return slugger.slug(input);
}

export function dirSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
