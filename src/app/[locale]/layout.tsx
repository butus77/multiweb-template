// src/app/[locale]/layout.tsx
import {NextIntlClientProvider, type AbstractIntlMessages} from 'next-intl';
import {notFound} from 'next/navigation';
import {locales, defaultLocale, type Locale} from '../../i18n';
import '@/app/globals.css';
import Header from '@/components/Header';
import {getBaseUrl} from '@/lib/site';
import { Toaster } from "sonner";  // ÚJ

/** A build tudja, mely locale-ok léteznek */
export async function generateStaticParams() {
  return [{locale: 'hu'}, {locale: 'sr'}, {locale: 'de'}, {locale: 'en'}];
}

/** SEO / hreflang + OpenGraph + Twitter (a base automatikusan DEV/PROD szerint) */
export async function generateMetadata() {
  const base = getBaseUrl();
  const title = 'MultiWeb';
  const description = 'Mobil-first, többnyelvű Next.js sablon.';

  return {
    title,
    description,
    alternates: {
      languages: {
        hu: `${base}/hu`,
        sr: `${base}/sr`,
        de: `${base}/de`,
        en: `${base}/en`
      }
    },
    metadataBase: new URL(base),
    openGraph: {
      type: 'website',
      url: base,
      title,
      description
      // Ha lesz OG kép: images: [{ url: `${base}/og.png`, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
      // images: [`${base}/og.png`]
    }
  };
}

/** Locale layout – NINCS <html>/<body> itt, az a root layoutban van */
export default async function LocaleLayout(
  {children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}
) {
  // A Next stringet ad → itt szűkítjük a saját unionunkra
  const {locale: raw} = await params;
  const l: Locale = (locales as readonly string[]).includes(raw) ? (raw as Locale) : defaultLocale;

  // Fordítások típusosan
  let messages: AbstractIntlMessages;
  try {
    messages = (await import(`../../../messages/${l}.json`)).default as AbstractIntlMessages;
  } catch {
    notFound();
  }

  return (
  <NextIntlClientProvider locale={l} messages={messages}>
    <div className="mx-auto max-w-5xl px-4">
      <Header locale={l} />
      <main className="py-8">{children}</main>
      <Footer />
    </div>
    <Toaster richColors position="top-right" />  {/* ÚJ */}
  </NextIntlClientProvider>
);
}

function Footer() {
  return (
    <footer className="py-10 text-sm text-neutral-500">
      © {new Date().getFullYear()} MultiWeb
    </footer>
  );
}

