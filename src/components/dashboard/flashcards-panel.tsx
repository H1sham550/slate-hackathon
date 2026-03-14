"use client";

import { useState } from "react";

const cards = [
  {
    question: "What is backpropagation?",
    answer: "An algorithm to compute gradients of loss with respect to network weights."
  },
  {
    question: "Why use regularization?",
    answer: "To reduce overfitting and improve model generalization."
  },
  {
    question: "What does learning rate control?",
    answer: "The step size used to update model parameters during training."
  },
  {
    question: "What is an epoch?",
    answer: "One complete pass through the full training dataset."
  }
];

export function FlashcardsPanel() {
  const [flipped, setFlipped] = useState<number[]>([]);

  const toggle = (index: number) => {
    setFlipped((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {cards.map((card, index) => {
        const isFlipped = flipped.includes(index);
        return (
          <button
            key={card.question}
            onClick={() => toggle(index)}
            className="glass-card flex min-h-40 flex-col justify-center rounded-3xl p-6 text-left hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(79,70,229,0.15)] ring-1 ring-transparent hover:ring-indigo-500/30"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-400">
              {isFlipped ? "Answer" : "Question"}
            </p>
            <p className="text-sm leading-6 text-slate-300">
              {isFlipped ? card.answer : card.question}
            </p>
          </button>
        );
      })}
    </section>
  );
}
