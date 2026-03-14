"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { CheckCircle2, History, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const [watchedClasses] = useState([
    { id: 1, title: "Neural Networks Introduction", date: "2026-03-01" },
    { id: 2, title: "Gradient Descent Fundamentals", date: "2026-03-05" },
    { id: 3, title: "Backpropagation Deep Dive", date: "2026-03-10" },
    { id: 4, title: "Regularization Techniques", date: "2026-03-12" },
  ]);

  const classesCount = watchedClasses.length;
  const targetClasses = 10;
  const progressPercentage = Math.min((classesCount / targetClasses) * 100, 100);
  const eligibleForSummary = classesCount >= targetClasses;

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 md:flex-row lg:gap-8">
        <Sidebar />
        <div className="flex-1 space-y-6">
          
          <header className="glass-panel flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="neon-text text-2xl font-bold tracking-tight">Student Profile</h1>
              <p className="mt-1 text-sm font-medium text-slate-400">Track your learning journey and earn monthly summaries.</p>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            <div className="md:col-span-2 space-y-4 md:space-y-6">
              
              {/* Progress Card */}
              <section className="glass-panel rounded-3xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100">Monthly Progress</h3>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-indigo-400">
                    {classesCount} / {targetClasses} Classes
                  </span>
                </div>
                
                <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400">
                  {eligibleForSummary 
                    ? "🎉 You've reached your goal! Your monthly summary is unlocked." 
                    : `Watch ${targetClasses - classesCount} more classes this month to unlock a comprehensive summary.`}
                </p>
              </section>

              {/* History Card */}
              <section className="glass-panel rounded-3xl p-6">
                <div className="mb-4 flex items-center gap-2">
                  <History className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-slate-100">Watched Classes</h3>
                </div>
                <div className="space-y-3">
                  {watchedClasses.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 transition-all hover:bg-slate-800/60">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span className="font-medium text-slate-300">{item.title}</span>
                      </div>
                      <span className="text-sm text-slate-500">{item.date}</span>
                    </div>
                  ))}
                  {watchedClasses.length === 0 && (
                    <p className="text-sm italic text-slate-500">No classes watched yet this month.</p>
                  )}
                </div>
              </section>

            </div>

            {/* Monthly Summary Sidebar */}
            <div className="md:col-span-1">
              <section className="glass-panel sticky top-6 rounded-3xl p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-slate-100">Monthly AI Summary</h3>
                </div>
                
                {eligibleForSummary ? (
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed text-slate-300">
                      <strong>Great job!</strong> Here is a synthesized overview of the 10 classes you watched this month:
                    </p>
                    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
                      <p className="text-sm italic text-slate-400">
                        "This month, you successfully moved from basic neural network architectures into deep dives on backpropagation and regularization. A key takeaway across all lectures is optimizing the loss space..."
                      </p>
                    </div>
                    <button className="group relative mt-2 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                        <div className="relative h-full w-10 bg-white/20" />
                      </div>
                      <span className="relative">View Full Report</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/50 bg-slate-900/20 p-6 text-center">
                    <Sparkles className="mb-2 h-8 w-8 text-slate-700" />
                    <p className="text-sm font-medium text-slate-500">Summary Locked</p>
                    <p className="mt-1 text-xs text-slate-600">Complete {targetClasses} classes to generate AI synthesis.</p>
                  </div>
                )}
              </section>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
