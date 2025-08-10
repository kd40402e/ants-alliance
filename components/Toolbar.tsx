"use client";
import { ChangeEvent } from "react";

type SortKey = "name_az" | "week_desc" | "all_desc";

export default function Toolbar({
  currentRoleLabel,
  queryText,
  setQueryText,
  sortKey,
  setSortKey,
  onAdd,
  onReset,
  onUpdateAll,
}: {
  currentRoleLabel: string;
  queryText: string;
  setQueryText: (v: string) => void;
  sortKey: SortKey;
  setSortKey: (k: SortKey) => void;
  onAdd: () => void;
  onReset: () => void;
  onUpdateAll: () => void;
}) {
  const onSearch = (e: ChangeEvent<HTMLInputElement>) => setQueryText(e.target.value);
  const onSort = (e: ChangeEvent<HTMLSelectElement>) =>
    setSortKey(e.target.value as SortKey);

  return (
    <div className="flex flex-col gap-3 p-3 border-b border-white/10">
      {/* Верхняя строка: текущая роль + поиск */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="text-sm font-semibold text-white">
          Текущая роль: <span className="font-bold">{currentRoleLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={queryText}
            onChange={onSearch}
            placeholder="Поиск по имени или заметке…"
            className="w-64 max-w-[70vw] rounded-xl px-3 py-2 bg-slate-800/60 text-white placeholder:text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={sortKey}
            onChange={onSort}
            className="rounded-xl px-3 py-2 bg-slate-800/60 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="name_az">Имя (А→Я)</option>
            <option value="week_desc">Неделя (по убыв.)</option>
            <option value="all_desc">Всего (по убыв.)</option>
          </select>
        </div>
      </div>

      {/* Нижняя строка: кнопки действий */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onAdd}
          className="rounded-xl px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          Добавить игрока
        </button>
        <button
          onClick={onReset}
          className="rounded-xl px-3 py-2 bg-slate-700 text-white hover:bg-slate-600 transition"
        >
          Сброс недели
        </button>
        <button
          onClick={onUpdateAll}
          className="rounded-xl px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Обновить неделю → Всего
        </button>
      </div>
    </div>
  );
}
