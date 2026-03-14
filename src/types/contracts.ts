export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "UPSTREAM_PROVIDER_ERROR"
  | "INTERNAL_ERROR";

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      error?: never;
    }
  | {
      success: false;
      data?: never;
      error: {
        code: ApiErrorCode;
        message: string;
        details?: unknown;
      };
    };

export type SourceType = "audio" | "transcript";
export type NetworkMode = "normal" | "adaptive";

export type LectureStatus =
  | "uploaded"
  | "transcribing"
  | "transcribed"
  | "transforming"
  | "transformed"
  | "failed";

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
};

export type TransformOutput = {
  lectureId: string;
  summary: string;
  notes: string;
  mermaidCode: string;
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  status: LectureStatus;
};

export type CreateLectureRequest = {
  title: string;
  sourceType: SourceType;
  audioPath?: string;
  language?: string;
  networkMode?: NetworkMode;
};

export type CreateLectureResponse = {
  id: string;
  title: string;
  status: LectureStatus;
  createdAt: string;
};

export type TranscribeRequest = {
  lectureId: string;
  audioPath: string;
  provider: "groq" | "azure" | "mock";
  language?: string;
};

export type TranscribeResponse = {
  lectureId: string;
  transcript: string;
  sttProvider: "groq" | "azure" | "mock";
  durationSeconds?: number;
  status: LectureStatus;
};

export type TransformRequest = {
  lectureId: string;
  transcript: string;
  targetLanguage?: string;
  networkMode?: NetworkMode;
  provider?: "github-models" | "groq" | "mock";
};
