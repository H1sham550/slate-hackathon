import { Play, Volume2 } from "lucide-react";

export function PlayerPanel() {
  return (
    <section className="glass-panel rounded-3xl p-6 space-y-5">
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Lecture Player</h3>
      <div className="aspect-video bg-slate-950/80 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center cursor-pointer hover:bg-indigo-500/30 transition-colors">
          <Play className="w-7 h-7 text-indigo-400 ml-1" fill="currentColor" />
        </div>
        <p className="text-slate-500 text-sm">Upload a lecture file to begin playback</p>
      </div>
      <div className="space-y-2">
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full w-[35%] rounded-full" />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>16:15</span>
          <Volume2 className="w-4 h-4" />
          <span>45:20</span>
        </div>
      </div>
    </section>
  );
}
