import {getTranslations} from "next-intl/server";
import HeaderClient from "@/components/HeaderClient";

export default async function Header({locale}:{locale: string}) {
  const t = await getTranslations();
  const labels = {
    home: t("Nav.home"),
    about: t("Nav.about"),
    // contact: t("Nav.contact")
  };
  return <HeaderClient locale={locale} labels={labels} />;
}

