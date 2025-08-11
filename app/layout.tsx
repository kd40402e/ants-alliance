import "./globals.css";
import ThemeInit from "@/components/ThemeInit";
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

        {/* Фоновая картинка + мягкое затемнение */}
        <div aria-hidden className="fixed inset-0 -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/inquisition-bg.png')" }}
          />
          {/* оверлей, чтобы текст читался в обеих темах */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20 dark:from-black/70 dark:via-black/50 dark:to-black/40" />
        </div>

        {/* Заголовок */}
        <header className="w-full flex justify-center pt-6 md:pt-8 pb-2 md:pb-4">
          <h1 className="font-cinzel text-4xl md:text-5xl font-extrabold text-yellow-300 drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]">
            Инквизиция
          </h1>
        </header>

        {/* Контент — ближе к центру и чуть уже */}
        <main className="w-full max-w-5xl mx-auto px-4 md:px-6 pb-10">
          {children}
        </main>
      </body>
    </html>
  );
}
