"use client";

import { useEffect, useState } from "react";
import mermaid from "mermaid";

type DiagramsPanelProps = {
  code?: string;
};

export function DiagramsPanel({ code }: DiagramsPanelProps) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        primaryColor: "#4f46e5",
        primaryTextColor: "#ffffff",
        lineColor: "#6366f1",
        tertiaryColor: "#eef2ff"
      }
    });

    if (!code) {
      setSvg("");
      return;
    }

    // Use a unique ID based on the content to avoid caching issues on re-render
    const renderId = `mermaid-${Math.random().toString(36).substring(7)}`;
    mermaid
      .render(renderId, code)
      .then(({ svg: renderedSvg }) => {
        setSvg(renderedSvg);
      })
      .catch((error) => {
        console.error("Failed to render mermaid diagram", error);
        setSvg("<p class='text-sm text-rose-500'>Unable to render Mermaid diagram.</p>");
      });
  }, [code]);

  return (
    <section className="glass-card rounded-3xl p-6">
      <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-indigo-400">Mermaid Flowchart</h4>
      {code ? (
        <div
          className="overflow-auto rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 shadow-inner"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <p className="text-sm text-slate-500 italic">No diagram generated yet.</p>
      )}
    </section>
  );
}
