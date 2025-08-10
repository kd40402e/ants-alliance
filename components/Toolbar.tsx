"use client";
import { Role } from "@/lib/roles";

type SortKey = "name_az" | "week_desc" | "all_desc";

export default function Toolbar({
  currentRole,
  currentRoleLabel,
  queryText,
  setQueryText,
  sortKey,
  setSortKey,
  onAdd,
  onReset,
  onUpdateAll,
}: {
  currentRole: Role;
  currentRoleLabel: string;             // ← добавили красивую метку
  queryText: string;
  setQueryText: (v: string) => void;
  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;
  onAdd: () => Promise<void>;
  onReset: () => Promise<void>;
  onUpdateAll: () => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-3 p-3 border-b dark:border-slate-700 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-white dark:text-white">Текущая роль:</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{currentRoleLabel}</span>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={queryText}
          onChange={(e) => setQueryText(e.currentTarget.value)}
          placeholder="Поиск по имени/заметке…"
          className="w-56 rounded-xl border px-3 py-2 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:outline-none focus:ring focus:ring-emerald-200"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.currentTarget.value as SortKey)}
          className="rounded-xl border px-3 py-2 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
          title="Сортировка"
        >
          <option value="name_az">Имя (A–Я)</option>
          <option value="week_desc">Итого (по убыв.)</option>
          <option value="all_desc">Всего (по убыв.)</option>
        </select>

        <button
  onClick={onAdd}
  className="rounded-xl px-3 py-2 bg-yellow-500 text-black border border-yellow-600 hover:bg-yellow-400 hover:shadow-[0_0_8px_rgba(255,215,0,0.6)] hover:border-yellow-400 transition"
>
  Добавить игрока
</button>

<button
  onClick={onReset}
  className="rounded-xl px-3 py-2 bg-slate-200 dark:bg-slate-700 dark:text-white border border-slate-400 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600 hover:shadow-[0_0_6px_rgba(255,215,0,0.4)] hover:border-yellow-400 transition"
>
  Сброс недели
</button>

<button
  onClick={onUpdateAll}
  className="rounded-xl px-3 py-2 bg-indigo-600 text-white border border-indigo-700 hover:bg-indigo-500 hover:shadow-[0_0_8px_rgba(255,215,0,0.6)] hover:border-yellow-400 transition"
>
  Обновить неделю → Всего
</button>

      </div>
    </div>
  );
}
