'use client';

import * as React from "react";
import {ThemeProvider as NextThemesProvider} from "next-themes";

export default function ThemeProvider({children}:{children: React.ReactNode}) {
  return (
    <NextThemesProvider
      attribute="class"    // → a <html> kapja a 'dark' class-t
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
// → a disableTransitionOnChange kiküszöböli a villanást
//    amikor a rendszer téma változik (pl. sötét mód bekapcsolás)