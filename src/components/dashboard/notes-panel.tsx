import { Sparkles, BookOpen } from "lucide-react";

type NotesPanelProps = {
  content?: string;
  summary?: string;
};

export function NotesPanel({ content, summary }: NotesPanelProps) {
  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center space-y-3 text-slate-500">
        <BookOpen className="w-10 h-10 opacity-30" />
        <p className="text-sm">No notes generated yet.<br />Paste a transcript and click <span className="text-indigo-400 font-medium">Transform Lecture</span>.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {summary && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <h4 className="text-sm font-semibold">AI Summary</h4>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{summary}</p>
        </div>
      )}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h4 className="text-xs text-slate-400 uppercase font-semibold tracking-wider">AI Notes</h4>
        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{content}</pre>
      </div>
    </div>
  );
}
