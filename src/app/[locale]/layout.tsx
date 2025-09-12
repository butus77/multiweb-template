// src/app/[locale]/layout.tsx
import {NextIntlClientProvider, type AbstractIntlMessages} from 'next-intl';
import {notFound} from 'next/navigation';
import {locales, defaultLocale, type Locale} from '../../i18n';
import '@/app/globals.css';
import Header from '@/components/Header';
import {getBaseUrl} from '@/lib/site';


/** A build tudja, mely locale-ok léteznek */
export async function generateStaticParams() {
  return [{locale: 'hu'}, {locale: 'sr'}, {locale: 'de'}, {locale: 'en'}];
}

/** SEO / hreflang (később cseréld a base-t saját domainre) */
export async function generateMetadata() {
  const base = 'https://example.com';
  return {
    title: 'MultiWeb',
    description: 'Mobil-first, többnyelvű Next.js sablon.',
    alternates: {
      languages: {
        hu: `${base}/hu`,
        sr: `${base}/sr`,
        de: `${base}/de`,
        en: `${base}/en`
      }
    },
    metadataBase: new URL(base)
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
