"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotesPanel } from "@/components/dashboard/notes-panel";
import { DiagramsPanel } from "@/components/dashboard/diagrams-panel";
import { FlashcardsPanel } from "@/components/dashboard/flashcards-panel";
import { QuizPanel } from "@/components/dashboard/quiz-panel";

export function TransformationTabs() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <Tabs defaultValue="notes" className="w-full">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <NotesPanel />
        </TabsContent>
        <TabsContent value="diagrams">
          <DiagramsPanel />
        </TabsContent>
        <TabsContent value="flashcards">
          <FlashcardsPanel />
        </TabsContent>
        <TabsContent value="quiz">
          <QuizPanel />
        </TabsContent>
      </Tabs>
    </section>
  );
}
