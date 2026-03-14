"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { GitBranch, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { supabase, getUserWatchedClasses } from "@/lib/supabase";

export default function KnowledgeGraphPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [lectures, setLectures] = useState<any[]>([]);
  const [graphSvg, setGraphSvg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      try {
        const classes = await getUserWatchedClasses(session.user.id);
        setLectures(classes || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load lecture history.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [router]);

  const generateGraph = useCallback(async () => {
    if (lectures.length === 0) return;
    setIsGenerating(true);
    setError(null);

    try {
      const nodes = new Set<string>();
      const edges: string[] = [];

      lectures.forEach((lecture, idx) => {
        const safeTitle = (lecture.title || "Untitled").replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 30);
        const nodeId = `L${idx}`;
        nodes.add(`  ${nodeId}["📚 ${safeTitle}"]`);

        // Parse Mermaid code if it exists
        if (lecture.diagram_code) {
          const lines = lecture.diagram_code.split("\n");
          lines.forEach((line: string) => {
            // Flexible regex to catch --> arrows with various label formats
            const arrowMatch = line.match(/(\w+)\[?.*?\]?\s*-->\s*(?:\|.*?\|)?\s*(\w+)(?:\[?(.*?)\]?)?/);
            if (arrowMatch) {
              const label = arrowMatch[3] || arrowMatch[2];
              if (label && label.length > 1) {
                const cleanLabel = label.replace(/[[\]"]/g, "").substring(0, 30);
                const topicId = `T${idx}_${cleanLabel.replace(/[^a-zA-Z0-9]/g, "")}`;
                nodes.add(`  ${topicId}["${cleanLabel}"]`);
                edges.push(`  ${nodeId} --> ${topicId}`);
              }
            }
          });
        }

        // Fallback: Extract keywords from summary if diagram parsing yields nothing
        const initialEdgeCount = edges.length;
        if (initialEdgeCount === 0 || edges.filter(e => e.startsWith(`  ${nodeId} -->`)).length === 0) {
          if (lecture.summary) {
            const keywords = lecture.summary
              .split(/\s+/)
              .filter((w: string) => w.length > 5)
              .map((w: string) => w.replace(/[^a-zA-Z0-9]/g, ""))
              .filter((w: string) => w.length > 3)
              .slice(0, 2);

            keywords.forEach((word: string, widx: number) => {
              const topicId = `K${idx}_${widx}`;
              nodes.add(`  ${topicId}["${word}"]`);
              edges.push(`  ${nodeId} --> ${topicId}`);
            });
          }
        }
      });

      const mermaidCode = `flowchart LR\n${Array.from(nodes).join("\n")}\n${edges.join("\n")}`;

      // Use a more robust encoding for characters (helpful for mermaid.ink)
      const json = JSON.stringify({ code: mermaidCode, mermaid: { theme: "dark" } });
      // Using unescape(encodeURIComponent(s)) is a common trick for UTF-8 with btoa
      const encoded = btoa(unescape(encodeURIComponent(json)));
      const svgUrl = `https://mermaid.ink/svg/${encoded}`;

      setGraphSvg(svgUrl);
    } catch (err: any) {
      console.error("Graph generation error:", err);
      setError("Failed to generate visualization.");
    } finally {
      setIsGenerating(false);
    }
  }, [lectures]);

  useEffect(() => {
    if (lectures.length > 0 && !graphSvg && !isGenerating) {
      generateGraph();
    }
  }, [lectures, graphSvg, isGenerating, generateGraph]);

  return (
    <main className="min-h-screen md:ml-20 lg:ml-64 p-4 md:p-6 lg:p-8">
      <Sidebar />
      <div className="mx-auto max-w-[1100px] space-y-6">

        <header className="glass-panel flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="neon-text text-2xl font-bold tracking-tight">Knowledge Graph</h1>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Visualize how your lecture topics connect and relate to each other.
            </p>
          </div>
          <button
            onClick={generateGraph}
            disabled={isGenerating || lectures.length === 0}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Regenerate Graph
          </button>
        </header>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <p className="text-sm font-medium text-rose-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-96 items-center justify-center rounded-3xl border border-slate-800/60 bg-slate-900/40">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : lectures.length === 0 ? (
          <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-16 text-center">
            <GitBranch className="mb-4 h-12 w-12 text-slate-700" />
            <h3 className="text-lg font-semibold text-slate-400">No Learning History</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              Process some lectures from the Dashboard to build your personal Knowledge Graph.
            </p>
            <button 
              onClick={() => router.push("/dashboard")}
              className="mt-6 rounded-xl bg-slate-800 px-6 py-2 text-sm font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/30 transition-all hover:bg-slate-700"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <section className="glass-panel overflow-hidden rounded-3xl p-6">
            {isGenerating ? (
              <div className="flex h-96 items-center justify-center bg-slate-950/20 rounded-2xl">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                  <p className="text-sm text-slate-400 animate-pulse">Analyzing subject relationships...</p>
                </div>
              </div>
            ) : graphSvg ? (
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/80 p-8 overflow-auto flex justify-center shadow-inner">
                <img
                  src={graphSvg}
                  alt="Knowledge Graph"
                  className="max-w-none h-auto min-h-[400px]"
                />
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/50 bg-slate-900/20">
                <p className="text-sm italic text-slate-500">Wait, something went wrong. Try regenerating the map.</p>
              </div>
            )}

            <div className="mt-8 border-t border-slate-800/60 pt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400/70 mb-4">Subject Sources</h4>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {lectures.map((l, i) => (
                  <div key={l.id} className="flex items-center gap-3 space-x-2 rounded-xl border border-slate-800/40 bg-slate-900/20 p-3 transition-colors hover:bg-slate-800/30">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-400">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{l.title}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{new Date(l.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
