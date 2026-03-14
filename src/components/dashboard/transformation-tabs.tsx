"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotesPanel } from "@/components/dashboard/notes-panel";
import { DiagramsPanel } from "@/components/dashboard/diagrams-panel";
import { FlashcardsPanel } from "@/components/dashboard/flashcards-panel";
import { QuizPanel } from "@/components/dashboard/quiz-panel";
import { TransformationData } from "@/types";
import { FileText, GitBranch, Layers, HelpCircle } from "lucide-react";

type TransformationTabsProps = {
  data: TransformationData | null;
};

export function TransformationTabs({ data }: TransformationTabsProps) {
  return (
    <section className="glass-panel overflow-hidden rounded-3xl p-6 h-full">
      <Tabs defaultValue="notes" className="w-full h-full flex flex-col">
        <TabsList className="self-start mb-2">
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Notes
          </TabsTrigger>
          <TabsTrigger value="diagrams" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> Diagrams
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <Layers className="w-4 h-4" /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Quiz
          </TabsTrigger>
        </TabsList>
        <TabsContent value="notes" className="flex-1">
          <NotesPanel content={data?.notes} summary={data?.summary} />
        </TabsContent>
        <TabsContent value="diagrams" className="flex-1">
          <DiagramsPanel code={data?.mermaidCode} />
        </TabsContent>
        <TabsContent value="flashcards" className="flex-1">
          <FlashcardsPanel />
        </TabsContent>
        <TabsContent value="quiz" className="flex-1">
          <QuizPanel questions={data?.quiz} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
