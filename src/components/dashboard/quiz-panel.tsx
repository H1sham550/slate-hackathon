"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuizQuestion } from "@/types";
import { ChevronRight, CheckCircle2, XCircle } from "lucide-react";

type QuizPanelProps = {
  questions?: QuizQuestion[];
};

export function QuizPanel({ questions }: QuizPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [answered, setAnswered] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <section className="glass-card rounded-3xl p-6">
        <p className="text-sm text-slate-500 italic">No quiz generated yet. Process a lecture to get quiz questions.</p>
      </section>
    );
  }

  const current = questions[currentIndex];
  const isAnswered = currentIndex in answered;
  const isCorrect = answered[currentIndex] === current.answer;
  const totalQuestions = questions.length;

  const handleSubmit = () => {
    if (!selected) return;
    const newAnswered = { ...answered, [currentIndex]: selected };
    setAnswered(newAnswered);
    if (selected === current.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected("");
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected("");
    setAnswered({});
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <section className="glass-card rounded-3xl p-6 text-center">
        <div className="mb-4">
          <p className="text-4xl font-bold text-indigo-400">{percentage}%</p>
          <p className="mt-1 text-sm text-slate-400">{score} out of {totalQuestions} correct</p>
        </div>
        <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full transition-all duration-500 ${percentage >= 70 ? "bg-emerald-500" : percentage >= 40 ? "bg-amber-500" : "bg-rose-500"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="mb-4 text-sm text-slate-300">
          {percentage >= 70 ? "🎉 Great job! You've mastered this material." : percentage >= 40 ? "📚 Good effort! Review the material and try again." : "💪 Keep studying! You'll get there."}
        </p>
        <button
          onClick={handleRestart}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
        >
          Retake Quiz
        </button>
      </section>
    );
  }

  return (
    <section className="glass-card rounded-3xl p-6">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-6 rounded-full transition-all ${
                i === currentIndex ? "bg-indigo-500" : i in answered ? (answered[i] === questions[i].answer ? "bg-emerald-500" : "bg-rose-500") : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <p className="mb-6 text-sm font-semibold leading-relaxed text-slate-100">{current.prompt}</p>

      {/* Options */}
      <RadioGroup value={selected} onValueChange={isAnswered ? undefined : setSelected} className="space-y-3">
        {current.options.map((option) => {
          let optionStyle = "border-slate-800/60 bg-slate-900/40 hover:bg-slate-800/60 hover:ring-1 hover:ring-indigo-500/30";
          if (isAnswered) {
            if (option === current.answer) {
              optionStyle = "border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/30";
            } else if (option === answered[currentIndex] && option !== current.answer) {
              optionStyle = "border-rose-500/50 bg-rose-500/10 ring-1 ring-rose-500/30";
            } else {
              optionStyle = "border-slate-800/60 bg-slate-900/40 opacity-50";
            }
          }
          return (
            <label
              key={option}
              className={`group flex cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 text-sm font-medium text-slate-300 transition-all ${optionStyle}`}
            >
              {isAnswered ? (
                option === current.answer ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> : option === answered[currentIndex] ? <XCircle className="h-5 w-5 text-rose-400 shrink-0" /> : <div className="h-5 w-5" />
              ) : (
                <RadioGroupItem value={option} id={`q${currentIndex}-${option}`} className="border-slate-500 text-indigo-500" />
              )}
              <span>{option}</span>
            </label>
          );
        })}
      </RadioGroup>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
          >
            {currentIndex < totalQuestions - 1 ? "Next Question" : "See Results"}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}
