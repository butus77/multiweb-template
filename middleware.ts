// middleware.ts
import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './src/i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
// The matcher above excludes paths starting with:
// - /api (API routes)
// - /_next (Next.js internals)
// - /_vercel (Vercel internals)
// - any path containing a dot (e.g., static files like .css, .js, images, etc.)
// You can adjust the matcher based on your specific needs. 
