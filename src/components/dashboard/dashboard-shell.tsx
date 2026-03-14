"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignalHigh, SignalLow, Loader2, Sparkles } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { PlayerPanel } from "@/components/dashboard/player-panel";
import { TransformationTabs } from "@/components/dashboard/transformation-tabs";
import { Switch } from "@/components/ui/switch";
import { TransformationData } from "@/types";
import { supabase, upload_lecture } from "@/lib/supabase";

export function DashboardShell() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TransformationData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"video" | "audio" | "youtube" | null>(null);
  const [inputMode, setInputMode] = useState<"audio" | "video" | "youtube">("video");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login"); // enforce authentication
      } else {
        setUserId(session.user.id);
      }
    }
    checkUser();
  }, [router]);

  const handleProcess = async () => {
    if (inputMode !== "youtube" && !selectedFile) {
      alert("Please select an audio or video file first.");
      return;
    }
    if (inputMode === "youtube" && !youtubeUrl) {
      alert("Please enter a YouTube URL.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      let transcript = "";
      let title = "Untitled Lecture";

      if (inputMode === "youtube") {
        setStatusMessage("Fetching YouTube transcript...");
        const ytRes = await fetch("/api/youtube-transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: youtubeUrl }),
        });
        const ytData = await ytRes.json();
        if (!ytRes.ok) throw new Error(ytData.error || "Failed to fetch YouTube transcript.");
        transcript = ytData.text;
        title = ytData.title || "YouTube Lecture";
      } else {
        setStatusMessage("Uploading & transcribing audio...");
        const formData = new FormData();
        formData.append("file", selectedFile!);

        const transcribeRes = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });
        const transcribeData = await transcribeRes.json();
        if (!transcribeRes.ok) throw new Error(transcribeData.error || "Transcription failed.");
        transcript = transcribeData.text;
        title = selectedFile!.name.replace(/\.[^/.]+$/, "");
      }

      setStatusMessage("Generating notes, diagrams & quizzes with AI...");

      // 2. Transform the text
      const transformRes = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const result = await transformRes.json();
      
      if (!transformRes.ok) throw new Error(result.error || "Transformation failed.");
      
      setData(result);

      // 3. Save the result to Supabase
      if (userId) {
        try {
          setStatusMessage("Saving to your profile...");
          await upload_lecture({
            user_id: userId,
            title: title,
            transcript: transcript,
            hierarchical_notes: result.notes,
            diagram_code: result.mermaidCode,
            summary: result.summary,
            quiz: result.quiz,
          });
        } catch (saveError: any) {
          console.warn("Could not save to Supabase (table may not exist yet):", saveError.message);
          // Don't throw — the user still gets their results
        }
      }

      setStatusMessage("Done! Your lecture has been processed.");
      
    } catch (error: any) {
      console.error("Failed to process lecture", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      setStatusMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen md:ml-20 lg:ml-64 p-4 md:p-6 lg:p-8">
      <Sidebar />
      <div className="mx-auto max-w-[1100px] space-y-6">
          <header className="glass-panel flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="neon-text text-2xl font-bold tracking-tight">Transformation Workspace</h1>
              <p className="mt-1 text-sm font-medium text-slate-400">
                Convert raw lectures into adaptive learning artifacts instantly.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Input Mode Selector */}
              <div className="flex items-center gap-2 rounded-2xl bg-slate-900/50 p-1.5 ring-1 ring-white/10">
                {(["video", "audio", "youtube"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setInputMode(mode);
                      setSelectedFile(null);
                      setMediaUrl(null);
                      setMediaType(null);
                      setYoutubeUrl("");
                    }}
                    className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                      inputMode === mode 
                        ? "bg-indigo-600 text-white shadow-lg" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>              {inputMode === "youtube" ? (
                <div className="flex items-center gap-2 rounded-2xl border border-slate-700/50 bg-slate-900/50 px-4 py-2.5 ring-1 ring-white/5 focus-within:ring-indigo-500/50 transition-all">
                  <input
                    type="text"
                    placeholder="Paste YouTube URL..."
                    className="bg-transparent text-sm text-slate-200 outline-none w-[250px]"
                    value={youtubeUrl}
                    onChange={(e) => {
                      setYoutubeUrl(e.target.value);
                      setMediaUrl(e.target.value);
                      setMediaType("youtube");
                    }}
                  />
                </div>
              ) : (
                <label className="cursor-pointer group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 px-6 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800/60 hover:text-indigo-400">
                  <input 
                    type="file" 
                    accept={inputMode === "video" ? "video/*" : "audio/*"}
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSelectedFile(file);
                      if (file) {
                        setMediaUrl(URL.createObjectURL(file));
                        setMediaType(inputMode);
                      } else {
                        setMediaUrl(null);
                        setMediaType(null);
                      }
                    }}
                  />
                  <span className="truncate max-w-[180px]">
                    {selectedFile ? selectedFile.name : `Select ${inputMode === "video" ? "Video" : "Audio"}`}
                  </span>
                </label>
              )}

              <button
                onClick={handleProcess}
                disabled={isLoading || (inputMode === "youtube" ? !youtubeUrl : !selectedFile)}
                className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-indigo-200" />}
                <span className="relative">Process Lecture</span>
              </button>
            </div>
          </header>

          {/* Status / Error Bar */}
          {statusMessage && (
            <div className="glass-panel flex items-center gap-3 rounded-2xl p-4">
              {isLoading && <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />}
              <p className="text-sm font-medium text-indigo-300">{statusMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm font-medium text-red-400">⚠️ {errorMessage}</p>
            </div>
          )}

          <PlayerPanel 
            adaptiveMode={false} 
            mediaUrl={mediaUrl} 
            mediaType={mediaType} 
          />
          <TransformationTabs data={data} />
      </div>
    </main>
  );
}
