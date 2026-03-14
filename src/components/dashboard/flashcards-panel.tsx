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
            className="min-h-40 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-200 hover:shadow"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {isFlipped ? "Answer" : "Question"}
            </p>
            <p className="text-sm leading-6 text-slate-700">
              {isFlipped ? card.answer : card.question}
            </p>
          </button>
        );
      })}
    </section>
  );
}
