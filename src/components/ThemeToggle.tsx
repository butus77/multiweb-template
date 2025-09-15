'use client';

import {useTheme} from "next-themes";
import {Sun, Moon} from "lucide-react";
import {useEffect, useState} from "react";

export default function ThemeToggle() {
  const {theme, setTheme, systemTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // elkerüli a hydration villogást

  const current = theme === "system" ? systemTheme : theme;
  const next = current === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next!)}
      aria-label={`Váltás ${current === "dark" ? "világos" : "sötét"} módra`}
      className="inline-flex items-center gap-2 px-2 py-1 rounded border hover:bg-muted text-sm"
    >
      {current === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">
        {current === "dark" ? "Világos" : "Sötét"}
      </span>
    </button>
  );
}
// A ThemeToggle komponens a téma (világos/sötét) váltására szolgál
// A useTheme hook segítségével éri el a jelenlegi témát és a váltó függvényt
// A useEffect hook biztosítja, hogy a komponens csak a kliens oldalon renderelődjön
// Ez elkerüli a szerver és kliens közötti eltéréseket (hydration issues)
// A gombon egy ikon és szöveg jelenik meg, ami a jelenlegi témától függően változik
// A gomb megnyomásakor a setTheme függvény hívódik meg, ami vált a világos és sötét mód között     