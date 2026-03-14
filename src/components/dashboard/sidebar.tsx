import Link from "next/link";
import { BookOpenText, GitBranch, Settings } from "lucide-react";

const navItems = [
  { label: "Recent Lectures", icon: BookOpenText },
  { label: "Knowledge Graph", icon: GitBranch },
  { label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="glass-panel w-full shrink-0 flex-col rounded-3xl p-6 md:flex md:w-72 md:min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <p className="Neon-text text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">
          S.L.A.T.E.
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-white drop-shadow-md">Learning Engine</h2>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const href = item.label === "Settings" || item.label === "Recent Lectures" ? "/profile" : "/";
          return (
            <Link
              href={href}
              key={item.label}
              className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-indigo-400"
            >
              <div className="flex items-center justify-center rounded-xl bg-slate-800/50 p-2 shadow-inner ring-1 ring-white/10 group-hover:bg-indigo-500/20 group-hover:ring-indigo-500/30">
                <Icon className="h-4 w-4" />
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
