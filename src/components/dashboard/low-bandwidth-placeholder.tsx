import { Wifi } from "lucide-react";

export function LowBandwidthPlaceholder() {
  return (
    <section className="glass-panel rounded-3xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Wifi className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Low-Bandwidth Summary</h3>
      </div>
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
        <h4 className="text-xs text-amber-400 font-semibold uppercase">Transcript (Compressed)</h4>
        <p className="text-sm text-slate-300 leading-relaxed">
          The lecture explains how adaptive learning systems first parse raw lecture input, identify key concepts,
          and then map those concepts into simplified semantic blocks. This bandwidth-safe transcript keeps only
          the critical context needed for revision and quiz generation.
        </p>
      </div>
    </section>
  );
}
