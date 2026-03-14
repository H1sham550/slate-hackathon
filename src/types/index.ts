export type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: string;
};

export type TransformationData = {
  summary?: string;
  notes?: string;
  mermaidCode?: string;
  quiz?: QuizQuestion[];
};
