import "./globals.css";
import ThemeInit from "@/components/ThemeInit";
import { LanguageProvider } from "@/components/LanguageProvider";
import SiteHeader from "@/components/SiteHeader";
import "@fontsource/cinzel/700.css";
import "@fontsource/cinzel/800.css";
import "@fontsource/cinzel/900.css";

export const metadata = {
  title: "Инквизиция — Активность альянса",
  description: "Отслеживание активности The Ants: Underground Kingdom",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen relative text-slate-900 dark:text-white">
        <ThemeInit />
        <LanguageProvider>
          {/* Фоновая картинка + мягкое затемнение */}
          <div aria-hidden className="fixed inset-0 -z-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/inquisition-bg.png')" }}
            />
            {/* оверлей, чтобы текст читался в обеих темах */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20 dark:from-black/70 dark:via-black/50 dark:to-black/40" />
          </div>

          <SiteHeader />

          {/* Контент — ближе к центру и чуть уже */}
          <main className="w-full max-w-5xl mx-auto px-4 md:px-6 pb-10">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
