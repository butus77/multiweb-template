import HeaderClient from "./HeaderClient";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/i18n";

export default async function Header({locale}:{locale: Locale}) {
  const t = await getTranslations({locale, namespace: "Nav"});
  const labels = { home: t("home"), about: t("about") };
  return <HeaderClient locale={locale} labels={labels} />;
}

