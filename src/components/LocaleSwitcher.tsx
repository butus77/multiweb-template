'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";

type Locale = 'hu' | 'sr' | 'de' | 'en';

export default function LocaleSwitcher({current}:{current: Locale}) {
  const pathname = usePathname() || '/';

  // Szétszedjük az aktuális útvonalat (pl. /hu/about → ["hu","about"])
  const raw = pathname.split(/[?#]/)[0];       // levágjuk query/hash részt
  const segments = raw.split('/').filter(Boolean);

  // Ha nincs locale a path elején, úgy kezeljük, mintha csak ["hu"] lenne.
  // De nálunk a router mindig /[locale]/... formában van, így a 0. elem a nyelv.
  const rest = segments.slice(1).join('/');

  const locales: Locale[] = ['hu','sr','de','en'];

  return (
    <div className="flex gap-2" role="group" aria-label="Válassz nyelvet">
      {locales.map((l) => {
        const href = '/' + [l, rest].filter(Boolean).join('/');
        const active = l === current;
        return (
          <Link
            key={l}
            href={href}
            aria-current={active ? 'true' : undefined}
            className={`px-2 py-1 rounded text-xs uppercase
              ${active ? 'border font-semibold' : 'hover:underline'}`}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
