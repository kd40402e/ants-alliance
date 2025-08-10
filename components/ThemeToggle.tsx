"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const dark = stored ? stored === "dark" : root.classList.contains("dark");
    setIsDark(dark);
    if (dark) root.classList.add("dark"); else root.classList.remove("dark");
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !isDark;
    setIsDark(next);
    if (next) root.classList.add("dark"); else root.classList.remove("dark");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="rounded-xl px-3 py-2 border bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
      title="Переключить тему"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
