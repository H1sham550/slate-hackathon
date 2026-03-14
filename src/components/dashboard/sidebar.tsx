"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, GitBranch, Settings, LayoutDashboard } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Recent Lectures", icon: BookOpenText, href: "/profile" },
  { label: "Knowledge Graph", icon: GitBranch, href: "/knowledge-graph" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-20 flex-col items-center border-r border-slate-800/60 bg-[#0a0e1a]/90 backdrop-blur-xl py-8 md:flex lg:w-64">
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center lg:items-start lg:px-6 lg:w-full">
        <p className="neon-text text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">
          S.L.A.T.E.
        </p>
        <h2 className="mt-1 hidden text-lg font-bold tracking-tight text-white drop-shadow-md lg:block">
          Learning Engine
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full space-y-2 px-3 lg:px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.label}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all lg:px-4 ${
                isActive
                  ? "bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-indigo-400"
              }`}
            >
              <div
                className={`flex items-center justify-center rounded-xl p-2 shadow-inner ring-1 ${
                  isActive
                    ? "bg-indigo-500/20 ring-indigo-500/30"
                    : "bg-slate-800/50 ring-white/10 group-hover:bg-indigo-500/20 group-hover:ring-indigo-500/30"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
