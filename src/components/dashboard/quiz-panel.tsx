"use client";

import { useState } from "react";
import { QuizQuestion } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GlassButton } from "@/components/ui/glass-button";
import { HelpCircle, CheckCircle2, XCircle } from "lucide-react";

type QuizPanelProps = {
  questions?: QuizQuestion[];
};

export function QuizPanel({ questions }: QuizPanelProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center space-y-3 text-slate-500">
        <HelpCircle className="w-10 h-10 opacity-30" />
        <p className="text-sm">No quiz generated yet.<br />Paste a transcript to generate quiz questions.</p>
      </div>
    );
  }

  const q = questions[current];
  const isCorrect = selected === q.answer;

  const handleNext = () => {
    setSelected(null);
    setChecked(false);
    setCurrent((c) => Math.min(c + 1, questions.length - 1));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs text-slate-400 uppercase font-semibold tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4" /> Quiz
        </h4>
        <span className="text-xs text-slate-500 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          {current + 1} / {questions.length}
        </span>
      </div>

      <p className="text-white font-semibold text-base">{q.prompt}</p>

      <RadioGroup value={selected ?? ""} onValueChange={setSelected} className="gap-3">
        {q.options.map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              checked && opt === q.answer
                ? "border-emerald-500/40 bg-emerald-500/10"
                : checked && opt === selected && !isCorrect
                ? "border-red-500/40 bg-red-500/10"
                : "border-white/10 bg-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5"
            }`}
          >
            <RadioGroupItem value={opt} id={opt} disabled={checked} />
            <span className="text-sm text-slate-200">{opt}</span>
          </label>
        ))}
      </RadioGroup>

      {checked && (
        <div className={`flex items-center gap-2 p-3 rounded-xl border text-sm ${isCorrect ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
          {isCorrect ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
          {isCorrect ? "Correct answer!" : `Try again. Correct answer: ${q.answer}`}
        </div>
      )}

      <div className="flex gap-3">
        {!checked ? (
          <GlassButton size="default" onClick={() => setChecked(true)} disabled={!selected}>
            Check Answer
          </GlassButton>
        ) : (
          <GlassButton size="default" onClick={handleNext} disabled={current >= questions.length - 1}>
            Next Question →
          </GlassButton>
        )}
      </div>
    </div>
  );
}
