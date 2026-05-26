import type { Metadata } from 'next';
import { siteConfig, withBasePath } from './site';
import type { Post } from './types';

export function buildSiteMetadata(): Metadata {
  const url = siteConfig.siteUrl;
  return {
    metadataBase: new URL(url),
    title: { default: siteConfig.title, template: `%s — ${siteConfig.title}` },
    description: siteConfig.description,
    applicationName: siteConfig.title,
    authors: [{ name: siteConfig.author, url: siteConfig.authorUrl }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    keywords: [
      'machine learning',
      'artificial intelligence',
      'LLM',
      'diffusion models',
      'transformers',
      'deep learning',
      'AI research'
    ],
    icons: {
      icon: [{ url: withBasePath('/favicon.svg'), type: 'image/svg+xml' }]
    },
    openGraph: {
      type: 'website',
      url,
      title: siteConfig.title,
      description: siteConfig.description,
      siteName: siteConfig.title,
      locale: siteConfig.locale
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description: siteConfig.description,
      creator: siteConfig.twitter
    },
    alternates: {
      canonical: url,
      types: { 'application/rss+xml': withBasePath('/feed.xml') }
    }
  };
}

export function buildPostMetadata(post: Post): Metadata {
  const url = `${siteConfig.siteUrl}/posts/${post.slug}/`;
  const title = post.frontmatter.title;
  const description = post.frontmatter.description || siteConfig.description;
  return {
    title,
    description,
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.updated,
      authors: [siteConfig.author],
      tags: post.frontmatter.tags
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.twitter
    },
    alternates: { canonical: url }
  };
}

export function postJsonLd(post: Post): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.updated || post.frontmatter.date,
    author: { '@type': 'Person', name: siteConfig.author, url: siteConfig.authorUrl },
    keywords: (post.frontmatter.tags || []).join(', '),
    url: `${siteConfig.siteUrl}/posts/${post.slug}/`,
    mainEntityOfPage: `${siteConfig.siteUrl}/posts/${post.slug}/`
  };
}
