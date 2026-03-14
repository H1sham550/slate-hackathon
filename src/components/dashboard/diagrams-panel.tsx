import { GitBranch } from "lucide-react";

type DiagramsPanelProps = {
  code?: string;
};

export function DiagramsPanel({ code }: DiagramsPanelProps) {
  if (!code) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center space-y-3 text-slate-500">
        <GitBranch className="w-10 h-10 opacity-30" />
        <p className="text-sm">No diagram generated yet.<br />Paste a transcript to generate a Mermaid flowchart.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <h4 className="text-xs text-slate-400 uppercase font-semibold tracking-wider flex items-center gap-2">
        <GitBranch className="w-4 h-4" /> Mermaid Flowchart
      </h4>
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <pre className="text-sm text-indigo-300 font-mono whitespace-pre-wrap">{code}</pre>
      </div>
      <p className="text-xs text-slate-500 italic">Note: Live Mermaid rendering requires the mermaid package integration.</p>
    </div>
  );
}
