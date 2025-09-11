import {getTranslations} from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations();
  return (
    <section className="grid gap-4">
      <h1 className="text-3xl font-extrabold">{t('Hero.title')}</h1>
      <p className="text-base text-neutral-700">{t('Hero.subtitle')}</p>
    </section>
  );
}
