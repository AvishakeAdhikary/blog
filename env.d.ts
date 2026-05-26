declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SITE_URL?: string;
    NEXT_PUBLIC_BASE_PATH?: string;
    NEXT_PUBLIC_DB_ADAPTER?: 'local' | 'prisma' | 'supabase' | 'firebase' | 'mongo';
    NEXT_PUBLIC_GISCUS_REPO?: string;
    NEXT_PUBLIC_GISCUS_REPO_ID?: string;
    NEXT_PUBLIC_GISCUS_CATEGORY?: string;
    NEXT_PUBLIC_GISCUS_CATEGORY_ID?: string;
    DATABASE_URL?: string;
  }
}
