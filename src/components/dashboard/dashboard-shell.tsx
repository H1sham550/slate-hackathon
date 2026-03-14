"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { PlayerPanel } from "./player-panel";
import { LowBandwidthPlaceholder } from "./low-bandwidth-placeholder";
import { TransformationTabs } from "./transformation-tabs";
import { Switch } from "@/components/ui/switch";
import { GlassButton } from "@/components/ui/glass-button";
import { TransformationData } from "@/types";
import { Sparkles, Wifi, WifiOff } from "lucide-react";

export function DashboardShell() {
  const [adaptiveMode, setAdaptiveMode] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [data, setData] = useState<TransformationData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTransform = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-8 py-5 border-b border-white/10 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white">Transformation Workspace</h1>
            <p className="text-slate-400 text-sm mt-0.5">Convert raw lectures into adaptive learning artifacts instantly.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              {adaptiveMode ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              <span className="text-sm text-slate-300 font-medium">
                {adaptiveMode ? "Adaptive Mode" : "Normal Mode"}
              </span>
              <Switch
                checked={adaptiveMode}
                onCheckedChange={setAdaptiveMode}
                aria-label="Toggle network mode"
              />
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-auto p-8 grid lg:grid-cols-5 gap-6">

          {/* Left panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {adaptiveMode ? <LowBandwidthPlaceholder /> : <PlayerPanel />}

            {/* Transcript Input */}
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Transcript / Paste Text</h3>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={6}
                placeholder="Paste your lecture transcript here to generate notes, diagrams, flashcards and a quiz..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              <GlassButton
                className="w-full flex items-center justify-center gap-2"
                size="default"
                onClick={handleTransform}
                disabled={loading || !transcript.trim()}
              >
                <Sparkles className="w-4 h-4" />
                {loading ? "Transforming..." : "Transform Lecture"}
              </GlassButton>
            </div>
          </div>

          {/* Right panel - Transformation tabs */}
          <div className="lg:col-span-3">
            <TransformationTabs data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}
