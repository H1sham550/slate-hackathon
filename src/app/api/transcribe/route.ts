import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// Increase the Next.js body size limit to 25MB (Groq's Whisper max)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Next.js App Router: use route segment config to increase the body limit
export const maxDuration = 60; // allow up to 60s for large files

export async function POST(req: Request) {
  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
    }

    const groq = new Groq({ apiKey: groqKey });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided in the form data" }, { status: 400 });
    }

    // Groq Whisper limit is 25MB. Check file size before sending.
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 25MB. For video files, please use a shorter clip or lower resolution.` },
        { status: 413 }
      );
    }

    // Call the Groq Whisper API
    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3-turbo",
      response_format: "verbose_json",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error: any) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
