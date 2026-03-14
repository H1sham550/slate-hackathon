"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotesPanel } from "@/components/dashboard/notes-panel";
import { DiagramsPanel } from "@/components/dashboard/diagrams-panel";
import { FlashcardsPanel } from "@/components/dashboard/flashcards-panel";
import { QuizPanel } from "@/components/dashboard/quiz-panel";
import { TransformationData } from "@/types";

type TransformationTabsProps = {
  data: TransformationData | null;
};

export function TransformationTabs({ data }: TransformationTabsProps) {
  return (
    <section className="glass-panel overflow-hidden rounded-3xl p-6">
      <Tabs defaultValue="notes" className="w-full">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <NotesPanel content={data?.notes} />
        </TabsContent>
        <TabsContent value="diagrams">
          <DiagramsPanel code={data?.mermaidCode} />
        </TabsContent>
        <TabsContent value="flashcards">
          <FlashcardsPanel cards={data?.quiz} />
        </TabsContent>
        <TabsContent value="quiz">
          <QuizPanel questions={data?.quiz} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
