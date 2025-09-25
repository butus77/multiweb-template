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
- **SEO**: `generateMetadata` nyelvspecifikus cím/leírás + `hreflang`, `app/sitemap.ts`, `app/robots.ts`.
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
```
Majd a `.env.local`-ban:
```env
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Fejlesztői szerver indítása:
```bash
npm run dev
```
A böngészőben a `http://localhost:3000` cím automatikusan átirányít a beállított alapértelmezett nyelvre (pl. `/hu`).

## Parancsok
```bash
npm run dev     # fejlesztés
npm run build   # prod build
npm run start   # prod szerver (build után)
npm run lint    # eslint ellenőrzés
```

## Könyvtárstruktúra (root-alapú)
```
.
├─ app/                       # App Router oldalak, layoutok, route-k
│  ├─ [locale]/               # Nyelvi gyökér (hu, de, en, sr)
│  │  ├─ layout.tsx           # Locale-specifikus provider + SEO
│  │  ├─ page.tsx             # Kezdőoldal per lokálé
│  │  ├─ about/page.tsx       # Rólunk
│  │  └─ contact/page.tsx     # Kapcsolat
│  ├─ globals.css             # Globális stílusok (Tailwind)
│  ├─ sitemap.ts              # Sitemap.xml generálás
│  └─ robots.ts               # Robots.txt generálás
├─ components/                # Újrafelhasználható UI komponensek
│  ├─ Header.tsx
│  ├─ LocaleSwitcher.tsx
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
├─ middleware.ts              # next-intl middleware + robots/sitemap kizárás
├─ tsconfig.json              # `@/*` → gyökér alias
├─ next.config.js             # Next.js beállítások (ha van)
└─ package.json
```

Fontos beállítások (`tsconfig.json`):
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

A fordítások betöltése a locale layoutban:
```typescript
const messages = (await import(`../../messages/${locale}.json`)).default;
```

## i18n – fordítások

**Hol?** `messages/<locale>.json`

**Használat komponensben:**
```tsx
'use client';
import {useTranslations} from 'next-intl';

export default function Hero() {
  const t = useTranslations();
  return <h1>{t('Hero.title')}</h1>;
}
```
JSON minta (ne használj pontot a kulcsokban, legyen fésűzött):
```json
{
  "Nav": { "home": "Kezdőlap", "about": "Rólunk", "contact": "Kapcsolat" },
  "Hero": { "title": "Üdv a MultiWeb sablonban", "subtitle": "Reszponzív, gyors, többnyelvű alap." }
}
```

### Új nyelv hozzáadása:
1.  **Fájl hozzáadása**: `messages/it.json`
2.  **Config frissítése**: `lib/i18n.ts` – `locales` tömbbe vedd fel:
    ```typescript
    export const locales = ['hu','sr','de','en','it'] as const;
    ```
3.  **Statikus paraméterek**: Ha `app/[locale]/layout.tsx` `generateStaticParams()`-ot használ, bővítsd ott is a listát.
4.  **Sitemap**: `app/sitemap.ts` – az új nyelv automatikusan bekerül a meglévő útvonalakhoz.

## Új oldal hozzáadása

Példa: Blog listázó oldal létrehozása a `app/[locale]/blog/page.tsx` útvonalon.

Az oldal létrehozása után a sitemap-ban is vedd fel az új útvonalat:
```typescript
// app/sitemap.ts
const routes = ['', '/about', '/contact', '/blog'] as const;
```

## SEO

-   **Meta + hreflang**: `app/[locale]/layout.tsx` `generateMetadata()` – nyelvspecifikus URL-ek, cím, leírás.
-   **Open Graph / Twitter**: Tölts fel egy `public/og.png` képet (ajánlott méret: 1200×630). A `generateMetadata` már hivatkozik rá.
-   **Sitemap**: `https://<domain>/sitemap.xml`
-   **Robots**: `https://<domain>/robots.txt`
-   **JSON-LD**: A `JsonLd` komponens szerver oldalon beágyazva (`Organization`, `WebSite`).

### Gyors ellenőrzőlista
-   A `/hu`, `/en`, `/de`, `/sr` útvonalak mind a saját nyelvükön jelennek meg.
-   A `/sitemap.xml` tartalmazza minden nyelv fő- és aloldalait.
-   A `/robots.txt` tartalmazza a `Sitemap: <...>/sitemap.xml` sort.
-   Facebook/X megosztásnál helyes cím/leírás/kép látszik.
-   A Google Rich Results Test látja az `Organization`/`WebSite` JSON-LD-t.

## Deploy Vercelre

1.  Push GitHubra → Vercelben `Import Project`.
2.  **Environment Variables** (Project → Settings):
    ```
    NEXT_PUBLIC_SITE_URL=https://<a-te-projekted>.vercel.app
    ```
3.  Deploy után ellenőrizd a `/robots.txt`, `/sitemap.xml` és a nyelvi oldalakat.

Ha a `robots.txt` a kezdőlapra irányítana, ellenőrizd, hogy a `middleware.ts`-ben ki van-e zárva a `robots.txt` és `sitemap.xml` útvonal.

## Hibaelhárítás

-   **`Module not found: Can't resolve './messages'`**
    Ellenőrizd a relatív importot az `app/[locale]/layout.tsx`-ban, és hogy a `messages/<locale>.json` fájl létezik-e.

-   **`[next-intl] Could not find i18n config`**
    Győződj meg róla, hogy létezik a `lib/i18n.ts`, és onnan importálsz mindenhol (`middleware`, `layout`).

-   **`The default export is not a React Component in "/page"`**
    Az oldalnak `default` exportált komponenssel kell visszaadnia JSX-et.

-   **`ESLint: Unexpected any`**
    Írj pontos típust (pl. `AbstractIntlMessages`, union típusok a `Locale`-hoz), vagy helyben tiltsd:
    ```typescript
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ```

-   **Tailwind v4 / PostCSS**
    A `postcss.config.mjs` használja az `@tailwindcss/postcss` plugint; telepítve kell lennie az `autoprefixer`-nek is.

## Útiterv (opcionális fejlesztések)
-   Biztonsági headerek (`next.config.ts`), CSP
-   OG-kép generátor (dinamikus szöveg/nyelv)
-   Analytics (Vercel Analytics / GA4) és Sentry
-   Form spamszűrés (Cloudflare Turnstile / hCaptcha)
-   GitHub Actions CI (build+lint PR-okra)

## Licenc
MIT
