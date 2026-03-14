import Groq from "groq-sdk";

// 1. Groq Client for Transcription
let _groq: Groq | null = null;
export function getGroqClient() {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY) {
       throw new Error("GROQ_API_KEY is not set.");
    }
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}

// 2. Groq Completion wrapper for LLM calls (replaces GitHub Models)
// Uses the single Groq client to also handle the text transformation
export async function callGroqLLM(
  messages: any[],
  model: string = "llama-3.1-8b-instant" // Use the newer 3.1 model
): Promise<any> {
  const client = getGroqClient();

  const response = await client.chat.completions.create({
    messages,
    model: model,
    temperature: 0.2,
    max_tokens: 4096,
    top_p: 1.0,
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content || "{}";
  
  try {
     return JSON.parse(content);
  } catch(e) {
      console.error("Failed to parse JSON from Groq LLM: ", content);
      throw new Error("LLM did not return valid JSON");
  }
}
