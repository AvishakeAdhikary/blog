export interface PostFrontmatter {
  title: string;
  description?: string;
  date: string;
  updated?: string;
  tags?: string[];
  draft?: boolean;
  cover?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  html: string;
  toc: TocEntry[];
  raw: string;
  readingTime: { text: string; minutes: number; words: number };
}

export interface PostSummary {
  slug: string;
  title: string;
  description?: string;
  date: string;
  updated?: string;
  tags: string[];
  cover?: string;
  readingTime: { text: string; minutes: number; words: number };
  excerpt: string;
}

export interface TocEntry {
  id: string;
  text: string;
  depth: number;
}

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  authorUrl: string;
  siteUrl: string;
  locale: string;
  twitter?: string;
  navLinks: { label: string; href: string }[];
  social: {
    github?: string;
    rss?: string;
    [k: string]: string | undefined;
  };
}
