export type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: string;
};

export type TransformationData = {
  notes?: string;
  mermaidCode?: string;
  quiz?: QuizQuestion[];
};
