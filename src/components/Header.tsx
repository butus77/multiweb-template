import {getTranslations} from 'next-intl/server';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default async function Header({locale}:{locale: string}) {
  const t = await getTranslations();
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
      <div className="flex items-center justify-between py-3 mx-auto max-w-5xl px-4">
        <a href={`/${locale}`} className="font-bold">MultiWeb</a>
        <nav className="flex items-center gap-4 text-sm">
          <a href={`/${locale}`} className="hover:underline">{t('Nav.home')}</a>
          <a href={`/${locale}/about`} className="hover:underline">{t('Nav.about')}</a>
          {/* ha van: <a href={`/${locale}/contact`} className="hover:underline">{t('Nav.contact')}</a> */}
          <LocaleSwitcher current={locale} />
        </nav>
      </div>
    </header>
  );
}
