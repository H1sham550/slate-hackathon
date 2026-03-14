export function LowBandwidthPlaceholder() {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-white to-indigo-50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Low-Bandwidth Summary</h3>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
          Adaptive Mode
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <div className="rounded-xl border border-indigo-100 bg-white p-3">
          <svg
            viewBox="0 0 240 150"
            className="h-auto w-full"
            role="img"
            aria-label="AI generated lecture summary graphic"
          >
            <defs>
              <linearGradient id="node" x1="0" x2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <rect x="12" y="20" width="80" height="28" rx="8" fill="url(#node)" />
            <rect x="148" y="20" width="80" height="28" rx="8" fill="url(#node)" />
            <rect x="80" y="94" width="80" height="28" rx="8" fill="url(#node)" />
            <line x1="92" y1="34" x2="148" y2="34" stroke="#818cf8" strokeWidth="2" />
            <line x1="52" y1="48" x2="110" y2="94" stroke="#818cf8" strokeWidth="2" />
            <line x1="188" y1="48" x2="130" y2="94" stroke="#818cf8" strokeWidth="2" />
            <text x="26" y="38" fill="white" fontSize="10" fontWeight="700">
              Context
            </text>
            <text x="165" y="38" fill="white" fontSize="10" fontWeight="700">
              Concepts
            </text>
            <text x="98" y="112" fill="white" fontSize="10" fontWeight="700">
              Outcome
            </text>
          </svg>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-slate-900">Transcript (Compressed)</p>
          <p className="text-sm leading-6 text-slate-600">
            The lecture explains how adaptive learning systems first parse raw lecture input,
            identify key concepts, and then map those concepts into simplified semantic blocks.
            This bandwidth-safe transcript keeps only the critical context needed for revision and
            quiz generation.
          </p>
        </div>
      </div>
    </div>
  );
}
