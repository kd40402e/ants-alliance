"use client";
import { useEffect } from "react";

export default function ThemeInit() {
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    if (stored === "dark") root.classList.add("dark");
    else if (stored === "light") root.classList.remove("dark");
    else {
      // follow system on first visit
      const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefers) root.classList.add("dark");
    }
  }, []);
  return null;
}