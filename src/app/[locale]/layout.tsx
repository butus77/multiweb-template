export async function generateMetadata({params}:{params: Promise<{locale:string}>}) {
  const {locale} = await params;
  const base = 'https://example.com'; // ← később saját domain
  return {
    title: 'MultiWeb',
    description: 'Mobil-first, többnyelvű Next.js sablon.',
    alternates: {
      languages: { hu: `${base}/hu`, sr: `${base}/sr`, de: `${base}/de`, en: `${base}/en` }
    }
  };
}



// src/app/[locale]/layout.tsx
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import type {Locale} from '../../i18n';
import '@/app/globals.css';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export async function generateStaticParams() {
  return [{locale: 'hu'}, {locale: 'sr'}, {locale: 'de'}, {locale: 'en'}];
}

export default async function LocaleLayout(
  {children, params}: {children: React.ReactNode; params: Promise<{locale: Locale}>}
) {
  const {locale} = await params;

  let messages: any;
  try {
    // három szinttel feljebb van a messages/ a projekt gyökerében
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="mx-auto max-w-5xl px-4">
        <Header locale={locale} />
        <main className="py-8">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}

function Header({locale}: {locale: Locale}) {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
      <div className="flex items-center justify-between py-3">
        <a href={`/${locale}`} className="font-bold">MultiWeb</a>
        <nav className="flex items-center gap-4 text-sm">
          <a href={`/${locale}`} className="hover:underline">Home</a>
          <a href={`/${locale}/about`} className="hover:underline">About</a>
          <LocaleSwitcher current={locale} />
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="py-10 text-sm text-neutral-500">
      © {new Date().getFullYear()} MultiWeb
    </footer>
  );
}

