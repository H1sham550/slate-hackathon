"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { GitBranch, Loader2, RefreshCw, Sparkles, BookOpen } from "lucide-react";
import { supabase, getUserWatchedClasses } from "@/lib/supabase";

// Types for the force-directed graph
interface Node {
  id: string;
  label: string;
  type: 'lecture' | 'topic';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface Edge {
  source: string;
  target: string;
}

export default function KnowledgeGraphPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lectures, setLectures] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: Node[], edges: Edge[] }>({ nodes: [], edges: [] });
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  // Load lectures
  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      try {
        const classes = await getUserWatchedClasses(session.user.id);
        setLectures(classes || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load learning history.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [router]);

  // Process lectures into nodes and edges
  const generateGraph = useCallback(() => {
    if (lectures.length === 0) return;

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const topicMap = new Map<string, string>(); // label -> nodeId

    lectures.forEach((lecture, idx) => {
      const lectureId = `L${idx}`;
      nodes.push({
        id: lectureId,
        label: lecture.title || "Untitled",
        type: 'lecture',
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: 0,
        vy: 0,
        radius: 28,
        color: '#6366f1' // Indigo
      });

      // Better topic extraction: Look for capitalized words or key technical terms
      const topics: string[] = [];
      if (lecture.summary) {
        // Simple regex for significant words: Capitalized or specific technical suffixes
        const matches = lecture.summary.match(/\b([A-Z][a-z]{4,}|[a-z]{3,}(?:tion|ity|ism|ment|ing))\b/g) as string[] | null;
        if (matches) {
          // Take top 5 unique significant words
          const uniqueMatches = Array.from(new Set(matches)).slice(0, 5);
          topics.push(...uniqueMatches);
        }
      }

      topics.forEach(topicLabel => {
        if (!topicLabel || topicLabel.length < 4) return;
        let topicNodeId = topicMap.get(topicLabel.toLowerCase());
        
        if (!topicNodeId) {
          topicNodeId = `T${nodes.length}`;
          topicMap.set(topicLabel.toLowerCase(), topicNodeId);
          nodes.push({
            id: topicNodeId,
            label: topicLabel,
            type: 'topic',
            x: Math.random() * 800,
            y: Math.random() * 600,
            vx: 0,
            vy: 0,
            radius: 14,
            color: '#10b981' // Emerald
          });
        }
        edges.push({ source: lectureId, target: topicNodeId });
      });
    });

    setGraphData({ nodes, edges });
  }, [lectures]);

  useEffect(() => {
    if (lectures.length > 0 && graphData.nodes.length === 0) {
      generateGraph();
    }
  }, [lectures, graphData.nodes.length, generateGraph]);

  // Force-directed simulation
  useEffect(() => {
    if (graphData.nodes.length === 0) return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const nodes = [...graphData.nodes];
    const edges = graphData.edges;

    const runSimulation = () => {
      // 1. Calculate Forces
      // Stronger Repulsion (Coulomb's Law)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          // Increase repulsion force constant from 1000 to 3000
          const force = 3000 / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          nodes[i].vx += fx;
          nodes[i].vy += fy;
          nodes[j].vx -= fx;
          nodes[j].vy -= fy;
        }
      }

      // Stronger Attraction with longer base distance
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          // Increase desired distance from 100 to 180 for a more spread out look
          const force = (distance - 180) * 0.03;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          source.vx += fx;
          source.vy += fy;
          target.vx -= fx;
          target.vy -= fy;
        }
      });

      // Centering and Friction
      nodes.forEach(node => {
        const centerX = width / 2;
        const centerY = height / 2;
        node.vx += (centerX - node.x) * 0.003; // Reduced centering force
        node.vy += (centerY - node.y) * 0.003;
        
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.85; // Increased friction for stability (0.9 -> 0.85)
        node.vy *= 0.85;

        // Boundary constraint
        node.x = Math.max(50, Math.min(width - 50, node.x));
        node.y = Math.max(50, Math.min(height - 50, node.y));
      });

      // 2. Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 3. Draw Edges (with varying strength)
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (source && target) {
          ctx.strokeStyle = 'rgba(79, 70, 229, 0.25)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });

      // 4. Draw Nodes
      nodes.forEach(node => {
        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = node.color;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = node.type === 'lecture' ? 'bold 13px Inter' : '11px Inter';
        ctx.textAlign = 'center';
        const label = node.label.length > 25 ? node.label.substring(0, 22) + '...' : node.label;
        ctx.fillText(label, node.x, node.y + node.radius + 18);
      });

      animationFrameId = requestAnimationFrame(runSimulation);
    };

    runSimulation();
    return () => cancelAnimationFrame(animationFrameId);
  }, [graphData]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const found = graphData.nodes.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < n.radius + 5;
    });
    setHoveredNode(found || null);
  };

  return (
    <main className="min-h-screen md:ml-20 lg:ml-64 p-4 md:p-6 lg:p-8 overflow-hidden">
      <Sidebar />
      <div className="mx-auto max-w-[1200px] h-full flex flex-col space-y-6">

        <header className="glass-panel flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h1 className="neon-text text-2xl font-bold tracking-tight">Learning Topology</h1>
            </div>
            <p className="text-sm font-medium text-slate-400">
              Floating nodes represent your lectures and unique concepts. Watch them cluster by relevance.
            </p>
          </div>
          <button
            onClick={() => { setGraphData({ nodes: [], edges: [] }); setTimeout(generateGraph, 100); }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Simulation
          </button>
        </header>

        <section className="glass-panel relative flex-1 min-h-[600px] rounded-3xl overflow-hidden bg-slate-950/40">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
          ) : lectures.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-12">
              <GitBranch className="mb-4 h-16 w-16 text-slate-700" />
              <h3 className="text-xl font-bold text-slate-300">Your Knowledge Galaxy is Empty</h3>
              <p className="mt-2 text-slate-500 max-w-md">
                Process lectures in the Dashboard to seed your map. Topics will emerge and connect as you learn.
              </p>
            </div>
          ) : (
            <>
              <canvas
                ref={canvasRef}
                width={1200}
                height={800}
                onMouseMove={handleCanvasMouseMove}
                className="w-full h-full cursor-crosshair"
              />
              
              {/* Overlay Legend */}
              <div className="absolute left-6 bottom-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/5 p-2 px-3 rounded-full">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                  <span className="text-xs font-bold text-slate-300">Lectures</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/5 p-2 px-3 rounded-full">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span className="text-xs font-bold text-slate-300">Key Topics</span>
                </div>
              </div>

              {/* Tooltip */}
              {hoveredNode && (
                <div 
                  className="absolute pointer-events-none transition-all duration-200"
                  style={{ left: `${hoveredNode.x + 20}px`, top: `${hoveredNode.y - 20}px` }}
                >
                  <div className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 p-4 rounded-2xl shadow-2xl min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                       {hoveredNode.type === 'lecture' ? <BookOpen className="h-4 w-4 text-indigo-400" /> : <GitBranch className="h-4 w-4 text-emerald-400" />}
                       <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{hoveredNode.type}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-100">{hoveredNode.label}</p>
                    {hoveredNode.type === 'topic' && (
                      <p className="text-xs text-slate-400 mt-1">Featured in {graphData.edges.filter(e => e.target === hoveredNode.id).length} lectures</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
