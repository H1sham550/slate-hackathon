import { PlayCircle } from "lucide-react";
import { LowBandwidthPlaceholder } from "@/components/dashboard/low-bandwidth-placeholder";

type PlayerPanelProps = {
  adaptiveMode: boolean;
};

export function PlayerPanel({ adaptiveMode }: PlayerPanelProps) {
  if (adaptiveMode) {
    return <LowBandwidthPlaceholder />;
  }

  return (
    <section className="glass-panel rounded-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Lecture Player</h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <PlayCircle className="h-4 w-4 text-indigo-400" />
          Streaming in Normal Mode
        </div>
      </div>
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/50 shadow-inner">
        <video
          className="h-full w-full"
          controls
          preload="metadata"
          poster="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1400&auto=format&fit=crop"
        >
          <source src="" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
