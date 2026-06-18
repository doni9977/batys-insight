import { Link, useRouterState } from "@tanstack/react-router";
import {
  MapPin,
  BarChart3,
  Building2,
  Sparkles,
  Settings,
  Download,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { to: string; label: string; icon: LucideIcon };

const mainNav: NavItem[] = [
  { to: "/", label: "Карта рисков", icon: MapPin },
  { to: "/analytics", label: "Аналитика и Тренды", icon: BarChart3 },
  { to: "/registry", label: "Реестр субъектов", icon: Building2 },
  { to: "/ai", label: "ИИ-Аналитик", icon: Sparkles },
];

const sysNav: NavItem[] = [
  { to: "/access", label: "Управление доступами", icon: Settings },
  { to: "/integrations", label: "Интеграции", icon: Download },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={[
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
        active
          ? "bg-gradient-to-r from-cyan-500/15 to-transparent text-cyan-300 border border-cyan-500/30 shadow-[0_0_20px_-8px_oklch(0.78_0.13_210/.6)]"
          : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent",
      ].join(" ")}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" size={18} />
      <span className="truncate">{item.label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_oklch(0.78_0.13_210)]" />}
    </Link>
  );
}

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[280px] flex-col border-r border-white/5 bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-5">
        <div className="relative grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/30 to-blue-600/30 border border-cyan-400/40">
          <ShieldCheck className="h-5 w-5 text-cyan-300" />
          <span className="absolute inset-0 rounded-lg shadow-[0_0_18px_-2px_oklch(0.78_0.13_210/.6)]" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide text-white">BatysMonitor</div>
          <div className="text-[11px] uppercase tracking-[0.15em] text-cyan-300/80">ДЭР ЗКО</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Мониторинг
        </div>
        <div className="space-y-1">
          {mainNav.map((i) => (
            <NavLink key={i.to} item={i} active={isActive(i.to)} />
          ))}
        </div>

        <div className="mt-6 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Система
        </div>
        <div className="space-y-1">
          {sysNav.map((i) => (
            <NavLink key={i.to} item={i} active={isActive(i.to)} />
          ))}
        </div>
      </nav>

      {/* Profile */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 text-sm font-semibold text-white">
            МД
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">Марат Даниал</div>
            <div className="truncate text-xs text-slate-400">Тимлид (Fullstack)</div>
          </div>
          <div className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_oklch(0.72_0.18_150)]" />
        </div>
      </div>
    </aside>
  );
}
