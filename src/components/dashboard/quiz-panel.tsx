"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: string;
};

const questions: QuizQuestion[] = [
  {
    prompt: "Which component controls model update step size?",
    options: ["Activation", "Learning Rate", "Batch Normalization", "Dropout"],
    answer: "Learning Rate"
  }
];

export function QuizPanel() {
  const [selected, setSelected] = useState<string>("");

  const current = questions[0];
  const isCorrect = selected === current.answer;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-4 text-sm font-semibold text-slate-900">{current.prompt}</p>
      <RadioGroup value={selected} onValueChange={setSelected}>
        {current.options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition hover:border-indigo-200"
          >
            <RadioGroupItem value={option} id={option} />
            <span>{option}</span>
          </label>
        ))}
      </RadioGroup>
      {selected && (
        <p
          className={`mt-4 text-sm font-medium ${
            isCorrect ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isCorrect ? "Correct answer." : `Try again. Correct answer: ${current.answer}.`}
        </p>
      )}
    </section>
  );
}
