import {useTranslations} from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  return (
    <section className="grid gap-4">
      <h1 className="text-3xl font-extrabold">{t('title')}</h1>
      <p className="text-base text-neutral-700">{t('subtitle')}</p>
    </section>
  );
}
