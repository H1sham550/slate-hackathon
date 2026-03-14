import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { checkRateLimit, withRetry } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const rl = checkRateLimit(`transform-${ip}`, 10, 60000); // 10 transforms / min
    if (!rl.success) {
      return apiError("RATE_LIMITED", "Transform rate limit exceeded", 429);
    }

    // 1. Parse payload
    const body = await req.json();
    const { lectureId, transcript, targetLanguage, networkMode, provider = "github-models" } = body;

    if (!lectureId || !transcript) {
      return apiError("VALIDATION_ERROR", "Missing required fields (lectureId, transcript)", 400);
    }

    // 2. Call LLM Provider
    let resultData: any = {};
    
    if (provider === "groq") {
      try {
        const { callGroqLLM } = await import("@/lib/ai-providers");
        
        const systemPrompt = `You are an expert AI teaching assistant for the SLATE app. 
Your task is to transform a raw lecture transcript into structured study materials.
Always output valid JSON exactly matching this structure, with no markdown code blocks wrapping the response, just the raw JSON:
{
  "summary": "1-2 paragraph detailed summary of the lecture.",
  "notes": "Markdown formatted bulleted notes containing key topics.",
  "mermaidCode": "A valid mermaid.js flowchart diagram representing the main concepts. Just the code, no markdown ticks.",
  "quiz": [
    {
      "id": "q1",
      "prompt": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A"
    }
  ],
  "flashcards": [
    {
       "id": "f1",
       "front": "Concept name",
       "back": "Concept definition"
    }
  ]
}

Ensure you generate at least 3 quiz questions and 5 flashcards based on the transcript provided. Target Language: ${targetLanguage || 'en'}, Network Mode: ${networkMode || 'adaptive'}`;

        const messages = [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is the lecture transcript:\n\n${transcript}` }
        ];

        resultData = await withRetry(async () => {
          return await callGroqLLM(messages);
        });

      } catch (err: any) {
        console.error("Groq LLM Transform failed:", err.message);
        return apiError("UPSTREAM_PROVIDER_ERROR", "LLM Transform failed: " + err.message, 502);
      }
    } else if (provider === "github-models") {
       return apiError("VALIDATION_ERROR", "GitHub Models provider is temporarily disabled.", 400);
    } else {
      return apiError("VALIDATION_ERROR", `Unsupported provider: ${provider}`, 400);
    }

    // 3. Construct Contract-compliant Response
    const data = {
      lectureId,
      summary: resultData.summary || "Summary Generation Failed.",
      notes: resultData.notes || "# Compilation Error\nCould not generate notes.",
      mermaidCode: resultData.mermaidCode || "flowchart TD\nA[Error]-->B[Failed to generate]",
      quiz: resultData.quiz || [],
      flashcards: resultData.flashcards || [],
      status: "transformed"
    };

    return apiSuccess(data, 200);
  } catch (err: any) {
    return apiError("INTERNAL_ERROR", "Failed to transform transcript", 500, err.message);
  }
}
