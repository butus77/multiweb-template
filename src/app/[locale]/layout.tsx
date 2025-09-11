import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import type {Locale} from '../../i18n';
import '@/app/globals.css';

export async function generateStaticParams() {
  return [{locale:'hu'},{locale:'sr'},{locale:'de'},{locale:'en'}];
}

export default async function LocaleLayout(
  {children, params}:{children: React.ReactNode; params: Promise<{locale: Locale}>}
) {
  const {locale} = await params;

  let messages: any;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default; // <-- EZ A LÉNYEG
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

function Header({locale}:{locale: Locale}) {
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

function LocaleSwitcher({current}:{current: Locale}) {
  const items: Locale[] = ['hu','sr','de','en'];
  return (
    <div className="flex gap-2">
      {items.map(l => (
        <a
          key={l}
          href={`/${l}`}
          className={`px-2 py-1 rounded ${current===l ? 'border' : 'hover:underline'}`}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
