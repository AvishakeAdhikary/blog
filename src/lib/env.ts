export const isDev = process.env.NODE_ENV !== 'production';
export const isProd = process.env.NODE_ENV === 'production';

export const dbAdapterName: 'local' | 'prisma' | 'supabase' | 'firebase' | 'mongo' =
  (process.env.NEXT_PUBLIC_DB_ADAPTER as
    | 'local'
    | 'prisma'
    | 'supabase'
    | 'firebase'
    | 'mongo'
    | undefined) || 'local';

export const giscus = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO || '',
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '',
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || '',
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ''
};

export function giscusEnabled(): boolean {
  return Boolean(giscus.repo && giscus.repoId && giscus.category && giscus.categoryId);
}
