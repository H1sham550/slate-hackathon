"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { CheckCircle2, History, Sparkles, LogOut, Loader2, ChevronDown, ChevronUp, FileText, RefreshCw } from "lucide-react";
import { supabase, getUserWatchedClasses, signOutUser } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const [watchedClasses, setWatchedClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [monthlySummary, setMonthlySummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [expandedLecture, setExpandedLecture] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      try {
        const classes = await getUserWatchedClasses(session.user.id);
        setWatchedClasses(classes || []);
      } catch (err) {
        console.error("Failed to load watched classes", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/login");
  };

  const handleGenerateSummary = async () => {
    if (!user) return;
    setIsGeneratingSummary(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      const res = await fetch("/api/profile/monthly-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, authToken }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMonthlySummary(data.summary);
      } else {
        alert(data.error || "Failed to generate summary. Process some lectures first!");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while generating the summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const classesCount = watchedClasses.length;

  return (
    <main className="min-h-screen md:ml-20 lg:ml-64 p-4 md:p-6 lg:p-8">
      <Sidebar />
      <div className="mx-auto max-w-[1100px] space-y-6">

        {/* Header */}
        <header className="glass-panel flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="neon-text text-2xl font-bold tracking-tight">Student Profile</h1>
            <p className="mt-1 text-sm font-medium text-slate-400">
              {user ? `Welcome back, ${user.user_metadata?.full_name || user.email}` : "Track your learning journey."}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-red-500/20 hover:text-red-400 ring-1 ring-white/10 hover:ring-red-500/30"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </header>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-800/60 bg-slate-900/40">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content: History + Notes (Full Width) */}
            <div className="lg:col-span-3 space-y-6">

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel rounded-2xl p-5 text-center">
                  <p className="text-3xl font-bold text-indigo-400">{classesCount}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Lectures Processed</p>
                </div>
                <div className="glass-panel rounded-2xl p-5 text-center">
                  <p className="text-3xl font-bold text-emerald-400">{classesCount > 0 ? Math.round(classesCount * 100 / Math.max(classesCount, 1)) : 0}%</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Completion Rate</p>
                </div>
              </div>

              {/* History & Saved Notes Card */}
              <section className="glass-panel rounded-3xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-semibold text-slate-100">Lecture History & Notes</h3>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-indigo-400">
                    {classesCount} lectures
                  </span>
                </div>
                <div className="space-y-3">
                  {watchedClasses.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/40 transition-all hover:bg-slate-800/40">
                      <button
                        onClick={() => setExpandedLecture(expandedLecture === item.id ? null : item.id)}
                        className="flex w-full items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                          <div className="text-left">
                            <span className="font-medium text-slate-300">{item.title}</span>
                            <p className="text-xs text-slate-500 mt-0.5">{new Date(item.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.hierarchical_notes && <FileText className="h-4 w-4 text-indigo-400" />}
                          {expandedLecture === item.id 
                            ? <ChevronUp className="h-4 w-4 text-slate-500" />
                            : <ChevronDown className="h-4 w-4 text-slate-500" />
                          }
                        </div>
                      </button>
                      
                      {/* Expanded Notes */}
                      {expandedLecture === item.id && (
                        <div className="border-t border-slate-800/60 px-4 pb-4 pt-3 space-y-3">
                          {item.summary && (
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Summary</p>
                              <p className="text-sm text-slate-300 leading-relaxed">{item.summary}</p>
                            </div>
                          )}
                          {item.hierarchical_notes && (
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Notes</p>
                              <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-400 max-h-[300px] overflow-y-auto rounded-xl bg-slate-950/50 p-4">
                                {item.hierarchical_notes}
                              </pre>
                            </div>
                          )}
                          {!item.summary && !item.hierarchical_notes && (
                            <p className="text-sm italic text-slate-500">No saved notes for this lecture.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {watchedClasses.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <History className="mb-3 h-10 w-10 text-slate-700" />
                      <p className="text-sm font-medium text-slate-500">No lectures yet</p>
                      <p className="mt-1 text-xs text-slate-600">Process a lecture from the Dashboard to see it here.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Bottom Section: AI Summary (Centered & Scrollable) */}
            <div className="lg:col-span-3">
              <section className="glass-panel overflow-hidden rounded-3xl p-8 md:p-10 border border-indigo-500/10 shadow-[0_0_40px_rgba(79,70,229,0.1)]">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-amber-500/10 p-2">
                      <Sparkles className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-100">AI Learning Synthesis</h3>
                      <p className="text-sm font-medium text-slate-500">A meta-summary of your entire lecture history</p>
                    </div>
                  </div>
                  {monthlySummary && (
                    <button 
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary}
                      className="flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition-all hover:bg-slate-700/60 ring-1 ring-white/10 disabled:opacity-50"
                    >
                      {isGeneratingSummary ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                      Regenerate
                    </button>
                  )}
                </div>

                {!monthlySummary ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/50 bg-slate-900/10 py-16 text-center">
                    <p className="max-w-md text-sm leading-relaxed text-slate-400 mb-8">
                      Click the button below to generate a comprehensive AI overview that synthesizes all your processed lectures into a cohesive study guide.
                    </p>
                    <button 
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary || classesCount === 0}
                      className="group relative flex items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 px-10 py-4 text-base font-bold text-white shadow-[0_0_25px_rgba(79,70,229,0.3)] transition-all hover:grow hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                        <div className="relative h-full w-12 bg-white/20" />
                      </div>
                      {isGeneratingSummary && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                      <span className="relative">
                        {isGeneratingSummary ? "Synthesizing Knowledge..." : classesCount === 0 ? "Process a lecture first" : "Generate Comprehensive Summary"}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="prose prose-invert prose-indigo max-w-full space-y-6 text-slate-300">
                         {/* We assume the summary is markdown, but for now we render as text with pre-wrap */}
                        <div className="whitespace-pre-wrap leading-relaxed text-base bg-slate-950/40 p-10 rounded-3xl border border-white/5 shadow-inner">
                          {monthlySummary}
                        </div>
                      </div>
                    </div>
                    {/* Shadow indicators for scroll */}
                    <div className="pointer-events-none absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-slate-900/40 to-transparent" />
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
