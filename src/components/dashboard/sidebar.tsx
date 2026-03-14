import { BookOpenText, GitBranch, Settings } from "lucide-react";

const navItems = [
  { label: "Recent Lectures", icon: BookOpenText },
  { label: "Knowledge Graph", icon: GitBranch },
  { label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:w-72">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
          S.L.A.T.E.
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">Learning Engine</h2>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
