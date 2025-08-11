// lib/roles.ts
export type Role = "P5" | "P4" | "P3" | "P2" | "P1";

export const ROLES: Role[] = ["P5", "P4", "P3", "P2", "P1"];

import type { Lang } from "./i18n";

export const ROLE_LABELS: Record<Lang, Record<Role, string>> = {
  ru: {
    P5: "Патриарх",
    P4: "Кардиналы",
    P3: "Инквизиторы",
    P2: "Аколиты",
    P1: "Подвал",
  },
  en: {
    P5: "Patriarch",
    P4: "Cardinals",
    P3: "Inquisitors",
    P2: "Acolytes",
    P1: "Basement",
  },
};

export function roleLabel(role: Role, lang: Lang) {
  return ROLE_LABELS[lang][role];
}


// 3) Узкое «as const»-представление всего набора (если нужно)
export const ALL_ROLES = ROLES;

// 4) Type guard
export function isRole(x: string): x is Role {
  return (ROLES as readonly string[]).includes(x);
}
