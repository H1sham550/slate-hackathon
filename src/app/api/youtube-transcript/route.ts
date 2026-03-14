import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // More robust video ID extraction
    let videoId = null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v");
        if (!videoId && urlObj.pathname.startsWith("/embed/")) {
          videoId = urlObj.pathname.split("/")[2];
        }
      }
    } catch (e) {
      // Fallback to regex if URL parsing fails
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      videoId = (match && match[2].length === 11) ? match[2] : null;
    }

    if (!videoId) {
      return NextResponse.json({ error: "Could not extract video ID from the provided URL. Please use a standard YouTube link." }, { status: 400 });
    }

    console.log(`[YouTube API] Fetching transcript for ID: ${videoId}`);

    // Fetch real transcript
    try {
      const transcriptChunks = await YoutubeTranscript.fetchTranscript(videoId);
      
      if (!transcriptChunks || transcriptChunks.length === 0) {
        throw new Error("No transcript chunks returned");
      }

      const fullText = transcriptChunks.map(chunk => chunk.text).join(" ");
      console.log(`[YouTube API] Successfully fetched ${fullText.length} characters of transcript.`);

      return NextResponse.json({
        success: true,
        text: fullText,
        title: `YouTube Lecture (${videoId})`,
        videoId: videoId
      });
    } catch (transcriptError: any) {
      console.error("[YouTube API] Transcript Fetch Error:", transcriptError.message || transcriptError);
      return NextResponse.json({ 
        error: "YouTube transcript not available for this video. This often happens if the video is set to 'No captions' or if YouTube is restricting access. Try a different video." 
      }, { status: 404 });
    }

  } catch (error: any) {
    console.error("[YouTube API] Global Error:", error);
    return NextResponse.json({ error: "Internal server error while fetching transcript." }, { status: 500 });
  }
}
