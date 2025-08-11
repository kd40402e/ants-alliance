"use client";
import LanguageToggle from "@/components/LanguageToggle";
import { useLang } from "@/components/LanguageProvider";

export default function SiteHeader() {
  const { t } = useLang();
  return (
    <header className="w-full flex justify-center pt-6 md:pt-8 pb-2 md:pb-4 relative">
      <h1 className="font-cinzel text-4xl md:text-5xl font-extrabold text-yellow-300 drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]">
        {t.siteTitle}
      </h1>
      <div className="absolute right-4 top-4">
        <LanguageToggle />
      </div>
    </header>
  );
}
