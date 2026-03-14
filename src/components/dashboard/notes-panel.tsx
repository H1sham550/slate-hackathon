const notes = `# Neural Networks: Lecture Summary

## Core Ideas
- A neural network is a layered function approximator.
- Backpropagation computes gradients efficiently.
- Generalization depends on data quality and regularization.

## Exam Tip
Focus on the relationship between **loss function**, **gradient descent**, and **learning rate**.`;

export function NotesPanel() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600">AI Notes</h4>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">{notes}</pre>
    </article>
  );
}
