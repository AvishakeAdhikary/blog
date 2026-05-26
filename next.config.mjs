const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const isProd = process.env.NODE_ENV === 'production';

// Strategy: the admin API route handlers must only exist when running `next dev`.
// In a production static export they would clash with `output: 'export'` because
// they use `dynamic = 'force-dynamic'`. We tag those files with the `.api.ts`
// extension and only include that extension when NOT building for export.
const pageExtensions = isProd
  ? ['ts', 'tsx', 'js', 'jsx']
  : ['api.ts', 'api.tsx', 'ts', 'tsx', 'js', 'jsx'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export only in production. In dev we keep a normal Next server so
  // the admin API routes under /app/api/admin/** are reachable.
  output: isProd ? 'export' : undefined,
  reactStrictMode: true,
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  poweredByHeader: false,
  compress: true,
  images: { unoptimized: true },
  pageExtensions,
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  // Cache static assets for 1 year in dev server (export handles this via host)
  ...(isProd
    ? {}
    : {
        async headers() {
          return [
            {
              source: '/_next/static/:path*',
              headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
            },
            {
              source: '/posts/:slug/assets/:file*',
              headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }]
            }
          ];
        }
      })
};

export default nextConfig;
