"use client";
import { useEffect, useMemo, useState } from "react";
import { auth, db, provider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  addDoc, collection, doc, onSnapshot, orderBy, query,
  updateDoc, where, deleteDoc
} from "firebase/firestore";

import type { Player, Week } from "@/lib/types";
import { Role, roleLabel, ROLES } from "@/lib/roles";
import RoleTabs from "@/components/RoleTabs";
import Toolbar from "@/components/Toolbar";
import PlayersTable from "@/components/PlayersTable";
import SummaryCard from "@/components/SummaryCard";
import useSummary from "@/lib/useSummary";
import ThemeToggle from "@/components/ThemeToggle";
import { useLang } from "@/components/LanguageProvider";

export default function Page() {
  const { t, lang } = useLang();
  const [user, setUser] = useState(auth.currentUser);
  const [role, setRole] = useState<Role>("P3");
  const [players, setPlayers] = useState<Player[]>([]);
  const [queryText, setQueryText] = useState("");
  const [sortKey, setSortKey] = useState<"name_az" | "week_desc" | "all_desc">("name_az");

  const summary = useSummary(!!user);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(setUser);
    return () => unsubscribeAuth();
  }, []);

 useEffect(() => {
  if (!user) return;
  const qRole = query(collection(db, "players"), where("role", "==", role), orderBy("name"));
  const unsub = onSnapshot(qRole, (snap) => {
    const arr: Player[] = [];
    snap.forEach((d) => {
      const data = d.data() as Omit<Player, "id">;
      arr.push({ id: d.id, ...data });
    });
    setPlayers(arr);
    }, (err) => {
      console.error("onSnapshot(role) error:", err);
      alert(t.indexAlert);
    });
    return () => unsub();
  }, [user, role, t.indexAlert]);



  const signIn = async () => { await signInWithPopup(auth, provider); };
  const signOutNow = async () => { await signOut(auth); };

  const filteredSorted = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    let list = players;
    if (q) {
      list = list.filter(p =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.note || "").toLowerCase().includes(q)
      );
    }
    const byName = (a: Player, b: Player) => (a.name || "").localeCompare(b.name || "", lang);
    const byWeek = (a: Player, b: Player) => (b.weekTotal || 0) - (a.weekTotal || 0) || byName(a, b);
    const byAll = (a: Player, b: Player) => (b.allTime || 0) - (a.allTime || 0) || byName(a, b);

    if (sortKey === "name_az") return [...list].sort(byName);
    if (sortKey === "week_desc") return [...list].sort(byWeek);
    return [...list].sort(byAll);
  }, [players, queryText, sortKey, lang]);

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl p-4 md:p-6 min-h-screen">
        <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow p-8 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-white">{t.allianceActivity}</h1>
          <button onClick={signIn} className="px-5 py-3 rounded-xl bg-black text-white hover:opacity-90">{t.signIn}</button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6 min-h-screen">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-white">{t.allianceActivity}</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-sm opacity-70">{user.email}</span>
          <button onClick={signOutNow} className="rounded-xl px-3 py-2 bg-slate-200 dark:bg-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600">{t.signOut}</button>
        </div>
      </header>

      <aside className="mb-4">
        <SummaryCard summary={summary} />
      </aside>

      <section className="mt-[80px]">
        <RoleTabs active={role} onChange={setRole} />
        <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-slate-900 via-black to-slate-950 shadow-lg">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04] bg-dots" />
        <Toolbar
  currentRoleLabel={roleLabel(role, lang)}
  queryText={queryText} setQueryText={setQueryText}
  sortKey={sortKey} setSortKey={setSortKey}
  onAdd={handleAdd} onReset={handleReset} onUpdateAll={handleUpdateAll}
/>
          <PlayersTable
            players={filteredSorted}
            onToggle={toggleDay}
            onNameBlur={updateName}
            onNoteBlur={updateNote}
            onDelete={deletePlayer}
            onPromote={promotePlayer}
            onDemote={demotePlayer}
          />
        </div>
      </section>
    </main>
  );

  async function handleAdd() {
    const base: Week = resetWeek();
    await addDoc(collection(db, "players"), {
      name: `${lang === 'ru' ? 'Игрок' : 'Player'} ${Math.random().toString(36).slice(2, 6)}`,
      role, week: base, weekTotal: 0, allTime: 0, note: "",
      updatedAt: Date.now()
    });
  }
  async function handleReset() {
    await Promise.all(players.map(p =>
      updateDoc(doc(db, "players", p.id), {
        week: resetWeek(), weekTotal: 0, updatedAt: Date.now()
      })
    ));
  }
  async function handleUpdateAll() {
    await Promise.all(players.map(p =>
      updateDoc(doc(db, "players", p.id), {
        allTime: (Number(p.allTime) || 0) + (Number(p.weekTotal) || 0),
        week: resetWeek(), weekTotal: 0, updatedAt: Date.now()
      })
    ));
  }
  async function toggleDay(p: Player, key: keyof Week) {
    const next = { ...p.week, [key]: !p.week[key] };
    const total = (Object.values(next) as boolean[]).filter(Boolean).length;
    await updateDoc(doc(db, "players", p.id), { week: next, weekTotal: total, updatedAt: Date.now() });
  }
  async function updateName(p: Player, name: string) {
    const v = name.trim();
    if (!v || v === p.name) return;
    await updateDoc(doc(db, "players", p.id), { name: v, updatedAt: Date.now() });
  }
  async function updateNote(p: Player, note: string) {
    const v = note.trim();
    if (v === (p.note ?? "")) return;
    await updateDoc(doc(db, "players", p.id), { note: v, updatedAt: Date.now() });
  }
  async function deletePlayer(p: Player) {
    if (!confirm(lang === 'ru' ? `Удалить игрока "${p.name}"?` : `Delete player "${p.name}"?`)) return;
    await deleteDoc(doc(db, "players", p.id));
  }

  async function promotePlayer(p: Player) {
    const idx = ROLES.indexOf(p.role);
    if (idx <= 0) return;
    const newRole = ROLES[idx - 1];
    await updateDoc(doc(db, "players", p.id), { role: newRole, updatedAt: Date.now() });
  }
  async function demotePlayer(p: Player) {
    const idx = ROLES.indexOf(p.role);
    if (idx === ROLES.length - 1) return;
    const newRole = ROLES[idx + 1];
    await updateDoc(doc(db, "players", p.id), { role: newRole, updatedAt: Date.now() });
  }
}

function resetWeek(): Week {
  return { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false };
}
