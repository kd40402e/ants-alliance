"use client";
import type { Player, Week } from "@/lib/types";
import { useLang } from "@/components/LanguageProvider";

const dayKeys: (keyof Week)[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function PlayersTable({
  players,
  onToggle,
  onNameBlur,
  onNoteBlur,
  onDelete,
}: {
  players: Player[];
  onToggle: (p: Player, k: keyof Week) => void;
  onNameBlur: (p: Player, name: string) => void;
  onNoteBlur: (p: Player, note: string) => void;
  onDelete: (p: Player) => void;
}) {
  const { t } = useLang();
  const dayNames = t.dayShort;

  // максимум по «Всего» среди игроков текущей роли
  const maxAll = players.length ? Math.max(...players.map((p) => Number(p.allTime || 0))) : 0;
  const totalWeek = players.reduce((a, p) => a + Number(p.weekTotal || 0), 0);
  const totalAll = players.reduce((a, p) => a + Number(p.allTime || 0), 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 dark:bg-slate-700 dark:text-white">
          <tr>
            <th className="p-2 text-left">{t.player}</th>
            {dayNames.map((d) => (
              <th key={d} className="p-2">
                {d}
              </th>
            ))}
            <th className="p-2">{t.weekTotal}</th>
            <th className="p-2">{t.allTotal}</th>
            <th className="p-2 text-left">{t.note}</th>
            <th className="p-2">{t.actions}</th>
          </tr>
        </thead>

        <tbody>
          {players.map((p) => (
            <tr
              key={p.id}
              className="border-t dark:border-slate-700 transition hover:border-yellow-400 hover:shadow-[0_0_6px_rgba(255,215,0,0.35)]"
            >
              {/* Имя */}
              <td className="p-2">
                <input
                  key={`name-${p.id}-${p.name}`}
                  defaultValue={p.name}
                  onBlur={(e) => onNameBlur(p, e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                  className="w-full rounded-lg border px-2 py-1 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:outline-none focus:ring focus:ring-emerald-200"
                />
              </td>

              {/* Дни недели */}
              {dayKeys.map((k) => (
                <td key={k} className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={!!p.week[k]}
                    onChange={() => onToggle(p, k)}
                    className="h-5 w-5 accent-emerald-600"
                  />
                </td>
              ))}

              {/* Итого за неделю — прогресс 0..7 */}
              <td className="p-2">
                <div className="h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/30 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-emerald-500 dark:bg-emerald-400 transition-all"
                    style={{ width: `${((p.weekTotal || 0) / 7) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-slate-900 dark:text-white">
                    {p.weekTotal || 0}
                  </div>
                </div>
              </td>

              {/* Всего — центр. число или «горящая» звезда с числом внутри у лидера */}
              <td className="p-2 text-center">
                {Number(p.allTime || 0) === maxAll && maxAll > 0 ? (
                  <StarBadge value={Number(p.allTime || 0)} />
                ) : (
                  <span className="text-white">{p.allTime ?? 0}</span>
                )}
              </td>

              {/* Заметка */}
              <td className="p-2">
                <input
                  key={`note-${p.id}-${p.note ?? ""}`}
                  defaultValue={p.note ?? ""}
                  placeholder={t.notePlaceholder}
                  onBlur={(e) => onNoteBlur(p, e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                  className="w-full rounded-lg border px-2 py-1 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:outline-none focus:ring focus:ring-emerald-200"
                />
              </td>

              {/* Действия */}
              <td className="p-2 text-center">
                <button
                  onClick={() => onDelete(p)}
                  className="rounded-lg px-2 py-1 bg-rose-600 text-white hover:bg-rose-700"
                >
                  {t.delete}
                </button>
              </td>
            </tr>
          ))}

          {/* Строка ИТОГО — центр и белый текст */}
          <tr className="bg-slate-800">
            <td colSpan={12} className="p-3 text-center text-white font-bold">
              {t.totalRow.replace('{week}', String(totalWeek)).replace('{all}', String(totalAll))}
            </td>
          </tr>

          {players.length === 0 && (
            <tr>
              <td colSpan={12} className="p-6 text-center text-slate-500 dark:text-slate-300">
                {t.noPlayers}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Глобальные ключевые кадры для «горящей» звезды */}
      <style jsx global>{`
        @keyframes star-burn {
          0%   { transform: scale(0.95) rotate(0deg);     filter: drop-shadow(0 0 0 rgba(255,200,40,.0)); }
          30%  { transform: scale(1.05) rotate(6deg);     filter: drop-shadow(0 0 10px rgba(255,210,60,.55)); }
          60%  { transform: scale(1.0)  rotate(-3deg);    filter: drop-shadow(0 0 6px rgba(255,210,60,.35)); }
          100% { transform: scale(1.06) rotate(3deg);     filter: drop-shadow(0 0 14px rgba(255,220,80,.85)); }
        }
      `}</style>
    </div>
  );
}

/** Полярная звезда с острыми лучами и числом внутри (ровная и центрированная) */
function StarBadge({ value }: { value: number }) {
  return (
    <div className="relative inline-flex items-center justify-center w-9 h-9">
      {/* Мягкое свечение под звездой */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-80"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,220,100,.7), rgba(255,220,100,0))",
        }}
      />
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 origin-center will-change-transform animate-[star-burn_2s_ease-in-out_infinite_alternate]"

      >
        {/* Длинный вертикальный ромб (главные лучи N-S) */}
        <polygon
          points="50,2 60,50 50,98 40,50"
          fill="#F4D03F"
          stroke="#E1B12C"
          strokeWidth="2"
          strokeLinejoin="miter"
          strokeMiterlimit={3}
        />
        {/* Короткий горизонтальный ромб (вторичные лучи E-W) */}
        <polygon
          points="10,50 50,40 90,50 50,60"
          fill="#FFE082"
          stroke="#E1B12C"
          strokeWidth="1.5"
          strokeLinejoin="miter"
          strokeMiterlimit={3}
        />
        {/* Маленькая «искра» под 45° для блеска */}
        <rect
          x="46"
          y="46"
          width="8"
          height="8"
          fill="#FFF4B0"
          transform="rotate(45 50 50)"
          opacity="0.9"
        />
      </svg>

      {/* Число внутри звезды */}
      <span className="relative z-10 text-[11px] font-extrabold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,.6)]">
        {value}
      </span>
    </div>
  );
}

