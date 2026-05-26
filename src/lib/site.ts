import siteJson from '../../content/site.json' with { type: 'json' };
import type { SiteConfig } from './types';

export const siteConfig: SiteConfig = siteJson as SiteConfig;

export const basePath: string = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withBasePath(path: string): string {
  if (!path) return basePath || '/';
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!basePath) return normalized;
  if (normalized.startsWith(basePath + '/') || normalized === basePath) return normalized;
  return `${basePath}${normalized}`;
}
