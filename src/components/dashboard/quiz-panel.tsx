"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuizQuestion } from "@/types";

type QuizPanelProps = {
  questions?: QuizQuestion[];
};

export function QuizPanel({ questions }: QuizPanelProps) {
  const [selected, setSelected] = useState<string>("");

  if (!questions || questions.length === 0) {
    return (
      <section className="glass-card rounded-3xl p-6">
        <p className="text-sm text-slate-500 italic">No quiz generated yet.</p>
      </section>
    );
  }

  const current = questions[0];
  const isCorrect = selected === current.answer;

  return (
    <section className="glass-card rounded-3xl p-6">
      <p className="mb-6 text-sm font-semibold leading-relaxed text-slate-100">{current.prompt}</p>
      <RadioGroup value={selected} onValueChange={setSelected} className="space-y-3">
        {current.options.map((option) => (
          <label
            key={option}
            className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 px-5 py-4 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800/60 hover:ring-1 hover:ring-indigo-500/30"
          >
            <RadioGroupItem value={option} id={option} className="border-slate-500 text-indigo-500" />
            <span>{option}</span>
          </label>
        ))}
      </RadioGroup>
      {selected && (
        <p
          className={`mt-4 text-sm font-medium ${
            isCorrect ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {isCorrect ? "Correct answer." : `Try again. Correct answer: ${current.answer}.`}
        </p>
      )}
    </section>
  );
}
