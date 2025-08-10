"use client";
import clsx from "clsx";
import { ROLES, ROLE_LABELS, Role } from "@/lib/roles";

export default function RoleTabs({
  active,
  onChange,
}: {
  active: Role;
  onChange: (role: Role) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 pl-[2px]">
      {ROLES.map((r) => {
        const isActive = active === r;

        const BaseBtn = (
          <button
            onClick={() => onChange(r)}
            className={clsx(
              "relative px-4 py-2 rounded-lg font-semibold transition-all duration-300",
              "text-white",
              isActive
                ? "bg-slate-900 shadow-[0_0_10px_rgba(255,255,255,0.6)] animate-[silver-pulse_2.2s_ease-in-out_infinite_alternate]"
                : "bg-slate-700 hover:scale-105 hover:shadow-[0_0_15px_silver]"
            )}
          >
            {ROLE_LABELS[r]}
          </button>
        );

        if (r === "P5") {
          return (
            <div
              key={r}
              className={clsx(
                "relative group",
                "hover:drop-shadow-[0_0_14px_rgba(239,68,68,0.55)]"
              )}
            >
              {/* Корона */}
              <div
                aria-hidden
                className={clsx(
                  "pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              >
                {/* Ореол */}
                <div
                  className="absolute -z-10 left-1/2 top-1 -translate-x-1/2 h-6 w-24 blur-lg opacity-80"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,70,70,.85) 0%, rgba(255,70,70,0) 70%)",
                  }}
                />
                <CenteredSpikedCrown className="h-9 w-24 animate-[crown-breathe_2.2s_ease-in-out_infinite_alternate]" />
              </div>

              {BaseBtn}
            </div>
          );
        }

        return <div key={r}>{BaseBtn}</div>;
      })}

      {/* keyframes */}
      <style jsx global>{`
        @keyframes silver-pulse {
          0% {
            transform: scale(1);
            filter: drop-shadow(0 0 4px rgba(200, 200, 200, 0.35));
          }
          100% {
            transform: scale(1.03);
            filter: drop-shadow(0 0 16px rgba(230, 230, 230, 0.95));
          }
        }
        @keyframes crown-breathe {
          0% {
            transform: translateY(0) scale(1);
            filter: drop-shadow(0 0 10px rgba(255, 120, 80, 0.55));
          }
          100% {
            transform: translateY(-1px) scale(1.06);
            filter: drop-shadow(0 0 22px rgba(255, 140, 100, 0.95));
          }
        }
      `}</style>
    </div>
  );
}

/** Центрированная шипованная корона (7 шипов) */
function CenteredSpikedCrown({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="-64 -40 128 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="goldBand"
          x1="-64"
          y1="0"
          x2="64"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#8B6B1B" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="75%" stopColor="#F6E27A" />
          <stop offset="100%" stopColor="#A37E21" />
        </linearGradient>
        <linearGradient
          id="goldSpike"
          x1="0"
          y1="-36"
          x2="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFD76A" />
          <stop offset="100%" stopColor="#B48116" />
        </linearGradient>
        <radialGradient
          id="gemRed"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0 0) scale(6)"
        >
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#860000" />
        </radialGradient>
      </defs>

      {/* обод */}
      <rect
        x={-48}
        y={10}
        width={96}
        height={8}
        rx={3}
        fill="url(#goldBand)"
        stroke="#B38A1E"
        strokeWidth={1.5}
      />
      {/* рельеф */}
      <rect
        x={-42}
        y={4}
        width={84}
        height={6}
        rx={3}
        fill="url(#goldBand)"
        opacity={0.9}
      />

      {/* 7 шипов */}
      {[
        { x: 0, h: 30 },
        { x: -14, h: 24 },
        { x: 14, h: 24 },
        { x: -26, h: 19 },
        { x: 26, h: 19 },
        { x: -38, h: 14 },
        { x: 38, h: 14 },
      ].map((s, i) => (
        <polygon
          key={i}
          points={`${s.x - 5},10 ${s.x},${10 - s.h} ${s.x + 5},10`}
          fill="url(#goldSpike)"
          stroke="#A67912"
          strokeWidth={1.2}
          strokeLinejoin="miter"
        />
      ))}

      {/* камни */}
      {[-30, -15, 0, 15, 30].map((gx, i) => (
        <circle
          key={i}
          cx={gx}
          cy={14}
          r={3.2}
          fill="url(#gemRed)"
          stroke="#6A0000"
          strokeWidth={0.9}
        />
      ))}
    </svg>
  );
}
