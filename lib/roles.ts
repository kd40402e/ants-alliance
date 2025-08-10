// lib/roles.ts
export type Role = "P5" | "P4" | "P3" | "P2" | "P1";

export const ROLES: Role[] = ["P5", "P4", "P3", "P2", "P1"];

export const ROLE_LABELS: Record<Role, string> = {
  P5: "Патриарх",
  P4: "Кардиналы",
  P3: "Инквизиторы",
  P2: "Аколиты",
  P1: "Подвал",
};


// 3) Узкое «as const»-представление всего набора (если нужно)
export const ALL_ROLES = ROLES;

// 4) Type guard
export function isRole(x: string): x is Role {
  return (ROLES as readonly string[]).includes(x);
}
