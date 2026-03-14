import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { userId, authToken } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Create a server-side Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials are not configured.");
    }

    // If a token is provided, use it to authenticate as the user
    // Otherwise use the provided key (likely anon or service role)
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      },
    });

    // 1. Fetch ALL of the user's lectures
    const { data: lectures, error } = await supabase
      .from("lectures")
      .select("title, summary, hierarchical_notes, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!lectures || lectures.length === 0) {
      return NextResponse.json({ 
        error: "No lectures found. Process some lectures first!",
      }, { status: 400 });
    }

    // Format all lectures for the prompt — include full notes
    const combinedContent = lectures.map((l, i) => {
      let entry = `Lecture ${i + 1}: ${l.title}\nDate: ${new Date(l.created_at).toLocaleDateString()}`;
      if (l.summary) entry += `\nSummary: ${l.summary}`;
      if (l.hierarchical_notes) {
        // Trim notes to avoid exceeding token limits
        const trimmedNotes = l.hierarchical_notes.substring(0, 2000);
        entry += `\nFull Notes:\n${trimmedNotes}`;
      }
      return entry;
    }).join("\n\n---\n\n");

    // 2. Send to GitHub Models to generate a comprehensive overview
    const token = process.env.GITHUB_TOKEN;
    const endpoint = "https://models.inference.ai.azure.com";

    if (!token) {
      throw new Error("GITHUB_TOKEN is missing for summary generation.");
    }

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const systemPrompt = `You are a meta-learning analyst for S.L.A.T.E. (Smart Learning through Adaptive Transformation Engine).
The student wants a comprehensive overview of ALL their processed lectures — with full compiled notes.

Your response should include:
1. **Learning Journey Overview** - A cohesive narrative of what they've studied across all lectures
2. **Compiled Notes** - Merge and organize the key notes from ALL lectures into a single, well-structured set of study notes. Use markdown headings, bullet points, and bold text.
3. **Key Themes & Connections** - Identify the major topics and show how concepts from different lectures relate
4. **Study Recommendations** - What they should review, deepen, or explore next

Make your response detailed and genuinely useful as study material. Use markdown formatting throughout.`;

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here are all ${lectures.length} lecture(s) with their full notes:\n\n${combinedContent}` },
      ],
      model: "gpt-4o",
      temperature: 0.4,
      max_tokens: 4000,
    });

    const summary = response.choices[0].message.content;

    return NextResponse.json({
      success: true,
      summary,
      lectureCount: lectures.length,
    });

  } catch (error: any) {
    console.error("Summary Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate summary" }, { status: 500 });
  }
}
