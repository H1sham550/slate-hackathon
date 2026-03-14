import { PlayCircle, Video, Music, Info, Youtube } from "lucide-react";
import { LowBandwidthPlaceholder } from "@/components/dashboard/low-bandwidth-placeholder";

type PlayerPanelProps = {
  adaptiveMode: boolean;
  mediaUrl?: string | null;
  mediaType?: "video" | "audio" | "youtube" | null;
};

export function PlayerPanel({ adaptiveMode, mediaUrl, mediaType }: PlayerPanelProps) {
  if (adaptiveMode) {
    return <LowBandwidthPlaceholder />;
  }

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = mediaType === "youtube" && mediaUrl ? getYoutubeId(mediaUrl) : null;

  return (
    <section className="glass-panel overflow-hidden rounded-3xl border border-white/5 shadow-2xl transition-all hover:border-indigo-500/20">
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/40 p-5 px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/10 p-2">
            {mediaType === "video" ? (
              <Video className="h-5 w-5 text-indigo-400" />
            ) : mediaType === "audio" ? (
              <Music className="h-5 w-5 text-indigo-400" />
            ) : mediaType === "youtube" ? (
              <Youtube className="h-5 w-5 text-red-500" />
            ) : (
              <PlayCircle className="h-5 w-5 text-indigo-400" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Lecture Player</h3>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              {mediaUrl ? "Media Loaded" : "Standby Mode"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-slate-950/50 px-3 py-1 text-[10px] font-bold text-indigo-400 ring-1 ring-white/10">
          <span className="relative flex h-1.5 w-1.5 overflow-hidden rounded-full">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
          </span>
          ACTIVE
        </div>
      </div>

      <div className="p-6">
        {!mediaUrl ? (
          <div className="flex aspect-video w-full flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 p-12 text-center transition-all">
            <div className="rounded-full bg-slate-900 p-4 ring-1 ring-white/5 shadow-inner">
              <PlayCircle className="h-10 w-10 text-slate-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">No Lecture Selected</p>
              <p className="mt-1 text-xs text-slate-600 max-w-[200px]">Upload a file or enter a YouTube URL to begin processing and playback.</p>
            </div>
          </div>
        ) : (
          <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
            {mediaType === "youtube" ? (
              youtubeId ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-sm text-red-400 font-medium p-8 text-center">
                  Invalid YouTube URL. Please check the link and try again.
                </div>
              )
            ) : mediaType === "video" ? (
              <video
                key={mediaUrl}
                className="h-full w-full object-contain"
                controls
                autoPlay
              >
                <source src={mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950/20 p-8">
                <div className="relative mb-8">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/20 blur-2xl"></div>
                  <div className="relative rounded-full bg-slate-900 p-8 ring-1 ring-indigo-500/30 shadow-2xl">
                    <Music className="h-16 w-16 text-indigo-400" />
                  </div>
                </div>
                <audio key={mediaUrl} className="w-full max-w-md [&::-webkit-media-controls-enclosure]:bg-slate-900/90 [&::-webkit-media-controls-panel]:bg-slate-900/90 rounded-full" controls autoPlay>
                  <source src={mediaUrl} />
                  Your browser does not support the audio tag.
                </audio>
                <p className="mt-6 text-xs font-medium tracking-wide text-indigo-300 animate-pulse">Now Playing Audio Transcript Source</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-indigo-500/5 p-4 ring-1 ring-indigo-500/10">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
          <p className="text-[11px] leading-relaxed text-slate-400">
            <span className="font-bold text-indigo-300">Tip:</span> {mediaType === 'youtube' ? 'YouTube transcripts are fetched automatically. If the video doesn\'t have captions, transcription might be limited.' : 'Your media is processed locally for playback. For the best transcription results, ensure the audio is clear.'}
          </p>
        </div>
      </div>
    </section>
  );
}
