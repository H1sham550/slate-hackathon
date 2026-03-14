"use client";

import { useEffect, useState } from "react";
import mermaid from "mermaid";

const mermaidCode = `flowchart TD
  A[Raw Lecture Transcript] --> B[Concept Extraction]
  B --> C[Structured Notes]
  B --> D[Flashcards]
  C --> E[Quiz Generation]
  D --> E`;

export function DiagramsPanel() {
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

    mermaid
      .render("slate-diagram", mermaidCode)
      .then(({ svg: renderedSvg }) => {
        setSvg(renderedSvg);
      })
      .catch(() => {
        setSvg("<p>Unable to render Mermaid diagram.</p>");
      });
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600">Mermaid Flowchart</h4>
      <div
        className="overflow-auto rounded-xl border border-indigo-100 bg-indigo-50/50 p-4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </section>
  );
}
