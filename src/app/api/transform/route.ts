import { NextResponse } from "next/server";

type TransformRequest = {
  transcript?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as TransformRequest;
  const transcript = body.transcript ?? "";

  return NextResponse.json({
    summary:
      transcript.length > 0
        ? "This lecture introduces key neural network concepts and optimization fundamentals."
        : "No transcript provided. Returning default mock summary.",
    mermaidCode: `flowchart TD\n  A[Transcript] --> B[AI Parser]\n  B --> C[Structured Notes]\n  B --> D[Quiz + Flashcards]`,
    notes: "# Mock Notes\\n- Concept extraction complete\\n- Ready for adaptive delivery",
    quiz: [
      {
        prompt: "What improves model generalization?",
        options: ["Overfitting", "Regularization", "Higher latency", "Noisy labels"],
        answer: "Regularization"
      }
    ]
  });
}
