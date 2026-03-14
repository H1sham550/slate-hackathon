"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Settings, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/lectures", icon: BookOpen, label: "All Lectures" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-900/60 backdrop-blur-xl hidden md:flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter neon-text">SLATE</h1>
        </Link>
        <p className="text-xs text-slate-600 mt-1 ml-10">Learning Engine</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all",
              pathname.startsWith(href)
                ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <Settings className="w-5 h-5 shrink-0" /> Settings
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <LogOut className="w-5 h-5 shrink-0" /> Logout
        </Link>
      </div>
    </aside>
  );
}
