"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ROLES, Role } from "@/lib/roles";  // <- единый источник ролей

export type SummaryMap = Record<Role, { week: number; all: number; count: number }>;


export default function useSummary(enabled: boolean) {
  const [summary, setSummary] = useState<SummaryMap>({
    P5:{week:0,all:0,count:0}, P4:{week:0,all:0,count:0}, P3:{week:0,all:0,count:0},
    P2:{week:0,all:0,count:0}, P1:{week:0,all:0,count:0},
  });

  useEffect(() => {
    if (!enabled) return;
    const unsubs = ROLES.map(r =>
      onSnapshot(query(collection(db,"players"), where("role","==",r)), snap => {
        let week=0, all=0, count=0;
        snap.forEach(d => {
          const p = d.data() as any;
          week += Number(p.weekTotal || 0);
          all  += Number(p.allTime   || 0);
          count += 1;
        });
        setSummary(prev => ({ ...prev, [r]: { week, all, count } }));
      })
    );
    return () => unsubs.forEach(u => u());
  }, [enabled]);

  return summary;
}
