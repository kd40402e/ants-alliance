"use client";
import { useLang } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { lang, toggle, t } = useLang();
  return (
    <button
      onClick={toggle}
      className="rounded-xl px-3 py-2 border bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
      title={t.changeLanguage}
    >
      {lang === "ru" ? "EN" : "RU"}
    </button>
  );
}
