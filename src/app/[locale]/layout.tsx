// src/app/[locale]/layout.tsx
import {NextIntlClientProvider, type AbstractIntlMessages} from 'next-intl';
import {notFound} from 'next/navigation';
import {locales, defaultLocale, type Locale} from '../../i18n';
import '@/app/globals.css';
import Header from '@/components/Header';
import {getBaseUrl} from '@/lib/site';
import ToasterPortal from '@/components/ToasterPortal';
// HA nem használod ténylegesen, töröld a következő sort, különben ESLint unused:
// import JsonLd from '@/components/JsonLd';

/** Build: mely locale-ok léteznek */
export async function generateStaticParams() {
  return [{locale: 'hu'}, {locale: 'sr'}, {locale: 'de'}, {locale: 'en'}];
}

/** SEO / hreflang + OpenGraph + Twitter (nyelvspecifikus URL) */
export async function generateMetadata(
  {params}: {params: Promise<{locale: string}>}
) {
  const {locale: raw} = await params;
  const l: Locale = (locales as readonly string[]).includes(raw) ? (raw as Locale) : defaultLocale;

  const base = getBaseUrl();
  const url = `${base}/${l}`;
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
      url,
      siteName: 'MultiWeb',
      title,
      description
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

/** Locale layout – NINCS <html>/<body> itt, az a root layoutban van */
export default async function LocaleLayout(
  {children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}
) {
  const {locale: raw} = await params;
  const l: Locale = (locales as readonly string[]).includes(raw) ? (raw as Locale) : defaultLocale;

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
      {/* Sonner toaster (kliens komponens) */}
      <ToasterPortal />
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
// Ezt a Footer komponenst át lehet helyezni egy külön fájlba is, ha szükséges.


