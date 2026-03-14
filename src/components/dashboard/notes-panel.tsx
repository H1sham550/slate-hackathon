type NotesPanelProps = {
  content?: string;
};

export function NotesPanel({ content }: NotesPanelProps) {
  return (
    <article className="glass-card rounded-3xl p-6">
      <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-indigo-400">AI Notes</h4>
      {content ? (
        <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-300">{content}</pre>
      ) : (
        <p className="text-sm text-slate-500 italic">No notes generated yet.</p>
      )}
    </article>
  );
}
