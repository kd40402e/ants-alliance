export type Role = import("./roles").Role;  // либо вообще убери и не экспортируй Role отсюда
export type Week = { mon:boolean; tue:boolean; wed:boolean; thu:boolean; fri:boolean; sat:boolean; sun:boolean; };
export type Player = {
  id: string; name: string; role: Role; week: Week;
  weekTotal: number; allTime: number; note?: string; updatedAt: number;
};
