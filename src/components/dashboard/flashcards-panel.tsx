"use client";

import { useState } from "react";
import { Layers, RotateCcw } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

const defaultCards = [
  { question: "What is an index in a database?", answer: "A data structure that improves the speed of data retrieval operations on a table." },
  { question: "What is regularization in ML?", answer: "A technique to prevent overfitting by adding a penalty term to the loss function." },
  { question: "What is the purpose of a B-Tree?", answer: "To keep data sorted and allow efficient insertion, deletion, and search operations." },
];

function Flashcard({ question, answer }: { question: string; answer: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer rounded-2xl p-6 border transition-all min-h-[140px] flex flex-col items-center justify-center text-center space-y-2 select-none"
      style={{ background: flipped ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.04)", borderColor: flipped ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.1)" }}
      onClick={() => setFlipped(!flipped)}
    >
      <span className="text-xs text-slate-500 uppercase tracking-wider">{flipped ? "Answer" : "Question"}</span>
      <p className="text-sm font-medium text-white">{flipped ? answer : question}</p>
      <span className="text-xs text-slate-600 mt-2">Click to {flipped ? "see question" : "reveal answer"}</span>
    </div>
  );
}

export function FlashcardsPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs text-slate-400 uppercase font-semibold tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4" /> Flashcards
        </h4>
        <GlassButton size="sm" className="flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </GlassButton>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {defaultCards.map((card, i) => (
          <Flashcard key={i} question={card.question} answer={card.answer} />
        ))}
      </div>
    </div>
  );
}
