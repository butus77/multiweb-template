import {getTranslations} from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations();
  return (
    <section className="prose max-w-none">
      <h1>{t('Nav.about')}</h1>
      <p>{t('About.body')}</p>
    </section>
  );
}
