import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract video ID for metadata simulation
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : "unknown";

    // Simulate fetching transcript
    // In a real production app, we would use 'youtube-transcript' or an official API
    const mockTranscript = `
      Welcome to this lecture on computer architecture and system design. 
      Today we are diving into the fundamental concepts of how modern processors handle instruction pipelines and out-of-order execution. 
      We'll discuss the Von Neumann architecture, the role of the Arithmetic Logic Unit, and how cache hierarchies (L1, L2, L3) significantly impact performance. 
      Specifically, we will look at how speculative execution helps in minimizing branch misprediction penalties. 
      This is crucial for understanding why certain coding patterns are faster than others on modern hardware.
    `.trim();

    return NextResponse.json({
      success: true,
      text: mockTranscript,
      title: `YouTube Lecture (${videoId})`,
      videoId: videoId
    });

  } catch (error: any) {
    console.error("YouTube Transcript API Error:", error);
    return NextResponse.json({ error: "Failed to fetch YouTube transcript" }, { status: 500 });
  }
}
