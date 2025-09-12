export function getBaseUrl() {
  // 1) PROD beállítható .env-ben: NEXT_PUBLIC_SITE_URL=https://sajatdomain.hu
  // 2) Vercel eset: VERCEL_URL-t automatikusan tölti (pl. my-app.vercel.app)
  // 3) Lokál: http://localhost:3000
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
  return envUrl || 'http://localhost:3000';
}
