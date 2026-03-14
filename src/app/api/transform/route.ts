import { OpenAI } from "openai";
import { NextResponse } from "next/server";

// Utility: recursively convert a nested object into readable markdown
function objectToMarkdown(obj: any, depth: number = 1): string {
  if (typeof obj === "string") return obj;
  if (Array.isArray(obj)) {
    return obj
      .map((item) =>
        typeof item === "string" ? `- ${item}` : objectToMarkdown(item, depth)
      )
      .join("\n");
  }
  if (typeof obj !== "object" || obj === null) return String(obj);
  return Object.entries(obj)
    .map(([key, val]) => {
      const heading = "#".repeat(Math.min(depth, 4));
      if (typeof val === "string") return `${heading} ${key}\n${val}`;
      if (Array.isArray(val)) {
        const items = val
          .map((v) =>
            typeof v === "string" ? `- ${v}` : objectToMarkdown(v, depth + 1)
          )
          .join("\n");
        return `${heading} ${key}\n${items}`;
      }
      return `${heading} ${key}\n${objectToMarkdown(val, depth + 1)}`;
    })
    .join("\n\n");
}

export async function POST(req: Request) {
  const token = process.env.GITHUB_TOKEN;
  const endpoint = "https://models.inference.ai.azure.com";

  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN is not configured." },
      { status: 500 }
    );
  }

  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "A valid transcript string is required." },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      baseURL: endpoint,
      apiKey: token,
    });

    const systemPrompt = `You are S.L.A.T.E., an advanced AI teaching assistant.
Your task is to analyze the provided lecture transcript and generate structured study materials.
You must output ONLY valid JSON matching the exact schema requested.

Generate a comprehensive JSON object containing:
1. "summary": A concise, 2-3 sentence overview of the lecture as a STRING.
2. "notes": A SINGLE MARKDOWN STRING (not a nested object!) with hierarchical notes covering all key concepts. Use # headings, - bullet points, and **bold** text for emphasis. This MUST be a flat string value, never a nested JSON object.
3. "mermaidCode": A valid Mermaid.js flowchart as a SINGLE STRING mapping out the core relationships between the topics discussed. The graph must start with "flowchart TD" followed by newline-separated node definitions.
4. "quiz": An array of at least 5 diverse multiple choice questions to test comprehensive understanding of the material. Each question object should have:
   - "prompt": The question string.
   - "options": An array of exactly 4 possible answer strings.
   - "answer": The correct answer string (must perfectly match one of the options).

CRITICAL: The "notes" field must be a single string, NOT an object. Example: "notes": "# Topic\\n- Point 1\\n- Point 2"
`;

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Here is the transcript to process:\n\n${transcript}`,
        },
      ],
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 4000,
      top_p: 1.0,
    });

    const outputContent = response.choices[0].message.content;

    if (!outputContent) {
      throw new Error("Received empty response from the model.");
    }

    const resultData = JSON.parse(outputContent);

    // Safety: if notes came back as an object, convert it to markdown
    let notes = resultData.notes || "No notes generated.";
    if (typeof notes !== "string") {
      notes = objectToMarkdown(notes);
    }

    return NextResponse.json({
      summary: resultData.summary || "Summary generation failed.",
      mermaidCode:
        resultData.mermaidCode ||
        "flowchart TD\n  Error[Failed to generate flowchart]",
      notes,
      quiz: resultData.quiz || [],
    });
  } catch (error: any) {
    console.error("Transformation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to transform lecture content." },
      { status: 500 }
    );
  }
}
