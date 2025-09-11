'use client';
import {usePathname, useRouter} from 'next/navigation';

const locales = ['hu','sr','de','en'] as const;

export default function LocaleSwitcher({current}:{current: string}) {
  const router = useRouter();
  const pathname = usePathname(); // pl. /hu/about

  function switchTo(next: string) {
    // 1) levágjuk a jelenlegi locale prefixet (első szegmens)
    const parts = pathname.split('/').filter(Boolean); // ["hu","about"]
    parts[0] = next; // ["de","about"]
    router.push('/' + parts.join('/'));
  }

  return (
    <div className="flex gap-2">
      {locales.map(l => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`px-2 py-1 rounded ${current===l ? 'border' : 'hover:underline'}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
