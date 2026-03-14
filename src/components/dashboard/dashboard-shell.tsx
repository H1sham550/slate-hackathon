"use client";

import { useState } from "react";
import { SignalHigh, SignalLow } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { PlayerPanel } from "@/components/dashboard/player-panel";
import { TransformationTabs } from "@/components/dashboard/transformation-tabs";
import { Switch } from "@/components/ui/switch";

export function DashboardShell() {
  const [adaptiveMode, setAdaptiveMode] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:gap-6">
        <Sidebar />
        <div className="flex-1 space-y-4 md:space-y-6">
          <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Transformation Workspace</h1>
              <p className="text-sm text-slate-500">
                Convert raw lectures into adaptive learning artifacts.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-3 py-2">
              {adaptiveMode ? (
                <SignalLow className="h-4 w-4 text-indigo-600" />
              ) : (
                <SignalHigh className="h-4 w-4 text-indigo-600" />
              )}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Network Mode</p>
                <p className="text-sm font-semibold text-slate-800">
                  {adaptiveMode ? "Adaptive Mode" : "Normal Mode"}
                </p>
              </div>
              <Switch checked={adaptiveMode} onCheckedChange={setAdaptiveMode} />
            </div>
          </header>

          <PlayerPanel adaptiveMode={adaptiveMode} />
          <TransformationTabs />
        </div>
      </div>
    </main>
  );
}
