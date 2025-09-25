# MultiWeb – Next.js 15, TypeScript, App Router, Tailwind v4, shadcn/ui, next-intl

Mobil-first, többnyelvű (hu/sr/de/en) weboldal-sablon. Prod-ready alapok: i18n, SEO (sitemap, robots, hreflang), OG/Twitter meta, JSON-LD, reszponzív UI (shadcn/ui), sötét mód, kapcsolat űrlap.

## Tartalomjegyzék
- [Funkciók](#funkciók)
- [Követelmények](#követelmények)
- [Gyors indítás](#gyors-indítás)
- [Parancsok](#parancsok)
- [Könyvtárstruktúra](#könyvtárstruktúra)
- [i18n – fordítások](#i18n--fordítások)
- [Új oldal hozzáadása](#új-oldal-hozzáadása)
- [SEO](#seo)
- [Deploy Vercelre](#deploy-vercelre)
- [Hibaelhárítás](#hibaelhárítás)
- [Útiterv (opcionális fejlesztések)](#útiterv-opcionális-fejlesztések)
- [Licenc](#licenc)

---

## Funkciók
- **Többnyelvűség**: [`next-intl`](https://next-intl.dev) (hu/sr/de/en), locale-alapú útvonalak (`/[locale]`), fordítások a `messages/` mappában.
- **UI**: Tailwind CSS **v4**, `shadcn/ui` (Button, Input, Card, Sheet, Separator), `sonner` toast. Mobil-first, reszponzív header (hamburger menü).
- **Tipográfia**: `next/font` (Inter), latin+latin-ext készletek.
- **Dark mode**: ThemeProvider (preferenciát tiszteletben tartó világos/sötét téma).
- **SEO**: `generateMetadata` nyelvspecifikus cím/leírás + `hreflang`, `sitemap.ts`, `robots.ts`.
- **Megosztás**: Open Graph / Twitter meta (`public/og.png` ajánlott).
- **Strukturált adatok**: JSON-LD (`Organization` + `WebSite`) a keresőknek.
- **Kapcsolat**: `/[locale]/contact` oldal – kliens-oldali validáció, visszajelzés toasttal. (Email/DB bekötés később.)

## Követelmények
- **Node.js 20+**
- **npm 10+**
- Git (ajánlott)

## Gyors indítás
```bash
# telepítés
npm i

# környezeti változók (fejlesztéshez)
cp .env.example .env.local
# majd a .env.local-ban:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000

# fejlesztői szerver
npm run dev
# böngésző: http://localhost:3000  → automatikus átirányítás pl. /hu
```

**.env példány:**
```env
# .env.example
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Parancsok
```bash
npm run dev     # fejlesztés
npm run build   # prod build
npm run start   # prod szerver (build után)
npm run lint    # eslint ellenőrzés
```

## Könyvtárstruktúra
```
.
├─ app/                       # App Router oldalak, layoutok, route-k
│  ├─ [locale]/               # Nyelvi gyökér (hu, de, en, sr)
│  │  ├─ layout.tsx           # Locale-specifikus provider + SEO
│  │  ├─ page.tsx             # Kezdőoldal per lokálé
│  │  ├─ about/ …             # Aloldalak
│  │  └─ contact/ …           # Kapcsolat oldal
│  ├─ globals.css             # Globális stílusok (Tailwind)
│  ├─ sitemap.ts              # Sitemap
│  └─ robots.ts               # Robots
├─ components/                # Újrafelhasználható UI komponensek
│  ├─ Header.tsx
│  ├─ ToasterPortal.tsx
│  └─ JsonLd.tsx
├─ lib/                       # Segédfüggvények, config
│  └─ site.ts
├─ messages/                  # Fordítási JSON-ok (next-intl)
│  ├─ hu.json
│  ├─ de.json
│  ├─ en.json
│  └─ sr.json
├─ public/                    # Statikus fájlok (og.png, logo, képek)
│  ├─ og.png
│  └─ logo40x40b.png
├─ scripts/                   # Build/utility scriptek (opcionális)
│  └─ build-photos.mjs
├─ tsconfig.json              # `@/*` → gyökér alias
├─ next.config.(js|ts)        # Next beállítások (ha van)
└─ package.json
```

**Fontos:**
- `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./*"]
      },
      "resolveJsonModule": true,
      "esModuleInterop": true
    }
  }
  ```
- Fordítások betöltése a locale layoutban:
  ```ts
  const messages = (await import(`../../messages/${locale}.json`)).default;
  ```
## i18n – fordítások
- **Hol?** `messages/<locale>.json`
- **Használat** komponensben:
  ```tsx
  'use client';
  import {useTranslations} from 'next-intl';
  export default function Hero() {
    const t = useTranslations();
    return <h1>{t('Hero.title')}</h1>;
  }
  ```
- **JSON minta (ne használj pontot a kulcsokban, legyen fésűzött):**
  ```json
  {
    "Nav": { "home": "Kezdőlap", "about": "Rólunk", "contact": "Kapcsolat" },
    "Hero": { "title": "Üdv a MultiWeb sablonban", "subtitle": "Reszponzív, gyors, többnyelvű alap." }
  }
  ```
- **Új nyelv hozzáadása**:
  1) Adj fájlt: `messages/it.json`
  2) `src/i18n.ts` – `locales` tömbbe vedd fel: `export const locales = ['hu','sr','de','en','it'] as const;`
  3) `src/app/[locale]/layout.tsx` `generateStaticParams()` automatikusan működik, ha az `i18n.ts`-ből olvasod; ha fix lista van benne, bővítsd ott is.
  4) `sitemap.ts` `routes` változóban minden oldal szerepeljen (pl. `'/about','/contact'`), az új nyelv automatikusan bekerül.

## Új oldal hozzáadása
Példa: Blog list oldal
```
src/app/[locale]/blog/page.tsx
```
Oldal létrehozása után **a sitemapban** vedd fel:
```ts
// src/app/sitemap.ts
const routes = ['', '/about', '/contact', '/blog'] as const;
```

## SEO
- **Meta + hreflang**: `src/app/[locale]/layout.tsx` `generateMetadata()` – nyelvspecifikus URL-ek, cím, leírás.
- **Open Graph / Twitter**:
  - Tedd `public/og.png`-t (1200×630).
  - A `generateMetadata` már hivatkozik rá.
- **Sitemap**: `https://<domain>/sitemap.xml`  
- **Robots**: `https://<domain>/robots.txt`
- **JSON-LD**: `JsonLd` komponens szerver oldalon beágyazva (`Organization`, `WebSite`).

### Gyors ellenőrzőlista
- `/hu`, `/en`, `/de`, `/sr` mind a saját nyelvén jelenik meg.
- `/sitemap.xml` tartalmazza minden nyelv fő- és aloldalait.
- `/robots.txt` tartalmazza a `Sitemap: <...>/sitemap.xml` sort.
- Slack/Facebook/X megosztásnál helyes cím/leírás/kép látszik.
- Rich Results Test látja az `Organization`/`WebSite` JSON-LD-t.

## Deploy Vercelre
1) Push GitHubra → Vercelben **Import Project**
2) **Environment Variables** (Project → Settings):
   ```
   NEXT_PUBLIC_SITE_URL = https://<a-te-projekted>.vercel.app
   ```
3) Deploy → ellenőrizd `/robots.txt`, `/sitemap.xml`, nyelvi oldalak.

> Ha a `robots.txt` mégis a kezdőlapra ugrana: a `middleware.ts`-ben legyen kizárás `robots.txt` és `sitemap.xml` útvonalakra.

## Hibaelhárítás
- **`Module not found: Can't resolve './messages'`**  
  Ellenőrizd a relatív importot az `src/i18n.ts`-ben, és hogy a `messages/<locale>.json` létezik.
- **`[next-intl] Could not find i18n config`**  
  Legyen `src/i18n.ts`, és onnan importálj mindenhol (middleware, layout).
- **`The default export is not a React Component in "/page"`**  
  Az oldalnak `default` exportált komponenssel kell visszaadnia JSX-et; legyen root `layout.tsx`.
- **ESLint `Unexpected any`**  
  Írj pontos típust (pl. `AbstractIntlMessages`, union típusok a `Locale`-hoz), vagy helyben tiltsd:  
  `// eslint-disable-next-line @typescript-eslint/no-explicit-any`
- **Tailwind v4 / PostCSS**  
  `postcss.config.mjs` használja az `@tailwindcss/postcss` plugint; telepítve legyen az `autoprefixer`.

## Útiterv (opcionális fejlesztések)
- Biztonsági headerek (`next.config.ts`), CSP később
- OG-kép generátor (dinamikus szöveg/nyelv)
- Analytics (Vercel Analytics / GA4) és Sentry
- Form spamszűrés (Cloudflare Turnstile / hCaptcha)
- GitHub Actions CI (build+lint PR-okra)

## Licenc
MIT (opcionális – igény szerint).
