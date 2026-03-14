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
    <section className="glass-panel overflow-hidden rounded-3xl p-6 border border-white/5 shadow-2xl">
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="mb-8 flex w-fit gap-2 rounded-2xl bg-slate-950/50 p-1.5 ring-1 ring-white/10">
          <TabsTrigger 
            value="notes" 
            className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
          >
            Notes
          </TabsTrigger>
          <TabsTrigger 
            value="diagrams"
            className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
          >
            Diagrams
          </TabsTrigger>
          <TabsTrigger 
            value="flashcards"
            className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
          >
            Flashcards
          </TabsTrigger>
          <TabsTrigger 
            value="quiz"
            className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
          >
            Quiz
          </TabsTrigger>
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
