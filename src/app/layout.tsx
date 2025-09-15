import "@/app/globals.css";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <head>
        {/* Engedjük mindkét színsémát a böngészőnek */}
        <meta name="color-scheme" content="dark light" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
// A RootLayout a teljes alkalmazás gyökér elrendezése
// A Google Fonts Inter betűtípust használja, a latin és latin-ext karakterkészlettel
// A ThemeProvider komponens biztosítja a téma (világos/sötét) kezelését az alkalmazásban
// A <meta name="color-scheme"> elem engedélyezi mindkét színsémát a böngésző számára
// A suppressHydrationWarning megakadályozza a React figyelmeztetéseit a szerver és kliens közötti eltérések miatt
// A body elem a betűtípus változót és alapértelmezett betűtípust alkalmazza
// A children prop tartalmazza az oldal tartalmát, amit a layout körülvesz  
