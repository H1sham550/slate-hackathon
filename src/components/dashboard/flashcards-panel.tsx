"use client";

import { useState } from "react";
import { QuizQuestion } from "@/types";
import { RotateCw } from "lucide-react";

type FlashcardsPanelProps = {
  cards?: QuizQuestion[];
};

export function FlashcardsPanel({ cards }: FlashcardsPanelProps) {
  const [flipped, setFlipped] = useState<number[]>([]);

  const toggle = (index: number) => {
    setFlipped((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };

  if (!cards || cards.length === 0) {
    return (
      <section className="glass-card rounded-3xl p-6">
        <p className="text-sm text-slate-500 italic">No flashcards yet. Process a lecture to generate flashcards from quiz questions.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {flipped.length} of {cards.length} revealed
        </p>
        <button
          onClick={() => setFlipped([])}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index);
          return (
            <button
              key={index}
              onClick={() => toggle(index)}
              className={`glass-card flex min-h-40 flex-col justify-center rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(79,70,229,0.15)] ring-1 ${
                isFlipped
                  ? "ring-emerald-500/30 bg-emerald-500/5"
                  : "ring-transparent hover:ring-indigo-500/30"
              }`}
            >
              <p className={`mb-3 text-xs font-bold uppercase tracking-wider ${isFlipped ? "text-emerald-400" : "text-indigo-400"}`}>
                {isFlipped ? "Answer" : "Question"} · Card {index + 1}
              </p>
              <p className="text-sm leading-6 text-slate-300">
                {isFlipped ? card.answer : card.prompt}
              </p>
              <p className="mt-3 text-[10px] font-medium text-slate-600">
                {isFlipped ? "Click to see question" : "Click to reveal answer"}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
