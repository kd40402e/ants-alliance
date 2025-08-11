"use client";
import { ROLES, roleLabel, Role } from "@/lib/roles";
import type { SummaryMap } from "@/lib/useSummary";
import { useLang } from "@/components/LanguageProvider";

export default function SummaryCard({ summary }: { summary: SummaryMap }) {
  const { t, lang } = useLang();
  const rows = ROLES.map((r: Role) => ({ role: r, ...summary[r] }));
  const totalWeek = rows.reduce((a, b) => a + (b.week || 0), 0);
  const totalAll  = rows.reduce((a, b) => a + (b.all  || 0), 0);

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* ДВА ОСКОЛКА — рисуем абсолютными слоями, чтобы всегда иметь высоту */}
      {/* Левый осколок */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-y-0 left-0 w-1/2 sm:w-[30%] z-0
          bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950
          backdrop-blur-md shadow-[inset_0_0_40px_rgba(255,255,255,0.08)]
          rounded-l-2xl
        "
        style={{
          clipPath: `
            polygon(
              0% 6%,
              88% 0%,
              98% 10%,
              92% 22%,
              99% 36%,
              92% 50%,
              99% 64%,
              92% 78%,
              98% 90%,
              88% 100%,
              0% 94%
            )
          `,
        }}
      />
      {/* Правый осколок */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-y-0 right-0 w-1/2 sm:w-[30%] z-0
          bg-gradient-to-bl from-slate-950 via-slate-900 to-blue-950
          backdrop-blur-md shadow-[inset_0_0_40px_rgba(255,255,255,0.08)]
          rounded-r-2xl
        "
        style={{
          clipPath: `
            polygon(
              12% 0%,
              100% 6%,
              100% 94%,
              12% 100%,
               4% 90%,
               9% 78%,
               2% 64%,
               9% 50%,
               2% 36%,
               9% 22%,
               4% 10%
            )
          `,
        }}
      />

      {/* КОНТЕНТ — поверх стекла. На мобильных 2 колонки 50/50, на больших 30/40/30 */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-[30%_40%_30%] gap-y-2 px-4 py-3 text-white">
        {/* Заголовок */}
        <div className="col-start-1 font-semibold">{t.summary}</div>
        <div className="col-start-2 sm:col-start-3" />

        {/* Строки: слева название роли, справа цифры */}
        {rows.map((r) => (
          <>
            <div key={`${r.role}-l`} className="col-start-1 text-sm font-medium">
              {roleLabel(r.role, lang)}
            </div>
            <div
              key={`${r.role}-r`}
              className="col-start-2 sm:col-start-3 text-sm tabular-nums text-right"
            >
              {r.count ?? 0} | {t.week}: {r.week ?? 0} | {t.all}: {r.all ?? 0}
            </div>
          </>
        ))}

        {/* ИТОГО — слово слева, суммы справа */}
        <div className="col-start-1 text-sm font-semibold">{t.total}</div>
        <div className="col-start-2 sm:col-start-3 text-sm font-semibold tabular-nums text-right">
          {t.week}: {totalWeek} | {t.all}: {totalAll}
        </div>
      </div>
    </div>
  );
}
