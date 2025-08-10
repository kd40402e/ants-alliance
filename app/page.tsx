"use client";
import { useEffect, useMemo, useState } from "react";
import { auth, db, provider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc, where, deleteDoc } from "firebase/firestore";

import type { Player, Week } from "@/lib/types";   // <- ТОЛЬКО Player, Week (без Role!)
import { Role, ROLE_LABELS } from "@/lib/roles";
               // <- Role берём отсюда
import RoleTabs from "@/components/RoleTabs";      // <- ЭТОТ импорт обязателен
import Toolbar from "@/components/Toolbar";
import PlayersTable from "@/components/PlayersTable";
import SummaryCard from "@/components/SummaryCard";
import useSummary from "@/lib/useSummary";
import ThemeToggle from "@/components/ThemeToggle";



const dayKeys: (keyof Week)[] = ["mon","tue","wed","thu","fri","sat","sun"];

export default function Page(){
  const [user, setUser] = useState(auth.currentUser);
  const [role, setRole] = useState<Role>("P3"); // стартовая
  const [players, setPlayers] = useState<Player[]>([]);
  const [queryText, setQueryText] = useState("");
  const [sortKey, setSortKey] = useState<"name_az"|"week_desc"|"all_desc">("name_az");

  const summary = useSummary(!!user);

  useEffect(()=>{ const u = auth.onAuthStateChanged(setUser); return ()=>u(); },[]); // subscribe to players of current role
  useEffect(()=>{
    if(!user) return;
    const qRole = query(collection(db,"players"), where("role","==",role), orderBy("name"));
    const unsub = onSnapshot(qRole, snap => {
      const arr: Player[] = [];
      snap.forEach(d=> arr.push({id:d.id, ...(d.data() as any)} as Player));
      setPlayers(arr);
    }, err => {
      console.error("onSnapshot(role) error:", err);
      alert("Нужен Firestore index для сортировки по имени. Открой консоль (F12), нажми Create index, подтверди, подожди минуту и обнови.");
    });
    return ()=>unsub();
  },[user, role]);

  const signIn = async()=>{ await signInWithPopup(auth, provider); };
  const signOutNow = async()=>{ await signOut(auth); };

  // filter + sort client-side
  const filteredSorted = useMemo(()=>{
    const q = queryText.trim().toLowerCase();
    let list = players;
    if(q){ list = list.filter(p=> (p.name||"").toLowerCase().includes(q) || (p.note||"").toLowerCase().includes(q)); }
    const byName = (a:Player,b:Player)=> (a.name||"").localeCompare(b.name||"","ru");
    const byWeek = (a:Player,b:Player)=> (b.weekTotal||0)-(a.weekTotal||0) || byName(a,b);
    const byAll  = (a:Player,b:Player)=> (b.allTime ||0)-(a.allTime ||0) || byName(a,b);
    return sortKey==="name_az"? [...list].sort(byName) : sortKey==="week_desc"? [...list].sort(byWeek) : [...list].sort(byAll);
  },[players, queryText, sortKey]);

  if(!user){
    return (
      <main className="mx-auto max-w-5xl p-4 md:p-6 min-h-screen">
        <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow p-8 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-white">Активность альянса</h1>
          <button onClick={signIn} className="px-5 py-3 rounded-xl bg-black text-white hover:opacity-90">Войти через Google</button>
        </div>
      </main>
    );
  }

 return (
  <main className="mx-auto max-w-6xl p-4 md:p-6 min-h-screen">
    <header className="flex items-center justify-between mb-4">
      <h1 className="text-xl md:text-2xl font-bold text-white">Активность альянса</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <span className="text-sm opacity-70">{user.email}</span>
        <button onClick={signOutNow} className="rounded-xl px-3 py-2 bg-slate-200 dark:bg-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600">Выйти</button>
      </div>
    </header>

    {/* СВОДКА — теперь ВСЕГДА над таблицей */}
    <aside className="mb-4">
      <SummaryCard summary={summary} />
    </aside>

    {/* ТАБЛИЦА */}
    <section className="mt-[80px]">
      <RoleTabs active={role} onChange={setRole} />
      <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-slate-900 via-black to-slate-950 shadow-lg">
  <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04] bg-dots" />

        <Toolbar
          currentRole={role}
          currentRoleLabel={ROLE_LABELS[role]}      // ← передаём красивую метку
          queryText={queryText}
          setQueryText={setQueryText}
          sortKey={sortKey}
          setSortKey={setSortKey}
          onAdd={handleAdd}
          onReset={handleReset}
          onUpdateAll={handleUpdateAll}
        />
        <PlayersTable
          players={filteredSorted}
          onToggle={toggleDay}
          onNameBlur={updateName}
          onNoteBlur={updateNote}
          onDelete={deletePlayer}
        />
      </div>
    </section>
  </main>
);


  async function handleAdd(){
    const base: Week = {mon:false,tue:false,wed:false,thu:false,fri:false,sat:false,sun:false};
    await addDoc(collection(db,"players"), { name:`Игрок ${Math.random().toString(36).slice(2,6)}`, role, week:base, weekTotal:0, allTime:0, note:"", updatedAt: Date.now() });
  }
  async function handleReset(){
    await Promise.all(players.map(p=> updateDoc(doc(db,"players",p.id), { week: resetWeek(), weekTotal:0, updatedAt: Date.now() }) ));
  }
  async function handleUpdateAll(){
    await Promise.all(players.map(p=> updateDoc(doc(db,"players",p.id), { allTime:(Number(p.allTime)||0)+(Number(p.weekTotal)||0), week: resetWeek(), weekTotal:0, updatedAt: Date.now() }) ));
  }
  async function toggleDay(p:Player, key:keyof Week){
    const next = { ...p.week, [key]: !p.week[key] };
    const total = (Object.values(next) as boolean[]).filter(Boolean).length;
    await updateDoc(doc(db,"players",p.id), { week: next, weekTotal: total, updatedAt: Date.now() });
  }
  async function updateName(p:Player, name:string){ const v=name.trim(); if(!v||v===p.name) return; await updateDoc(doc(db,"players",p.id), { name:v, updatedAt: Date.now() }); }
  async function updateNote(p:Player, note:string){ const v=note.trim(); if(v===(p.note??"")) return; await updateDoc(doc(db,"players",p.id), { note:v, updatedAt: Date.now() }); }
  async function deletePlayer(p:Player){ if(!confirm(`Удалить игрока "${p.name}"?`)) return; await deleteDoc(doc(db,"players",p.id)); }
}

function resetWeek(): Week { return {mon:false,tue:false,wed:false,thu:false,fri:false,sat:false,sun:false}; }
