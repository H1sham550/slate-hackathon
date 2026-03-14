# S.L.A.T.E.

Scalable Learning & Adaptive Text Engine

S.L.A.T.E. transforms lecture audio/transcripts into structured study materials that adapt to user constraints like bandwidth and readability.

## Built For

8-hour hackathon project focused on:
- Fast lecture-to-learning transformation
- Low-bandwidth adaptive consumption
- High-clarity EdTech dashboard UX

## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Primitives: Radix-based components (Shadcn-style modular structure)
- Icons: lucide-react
- Diagrams: mermaid
- Planned Backend/Auth: Supabase

## Current Features

### Dashboard Layout
- Responsive sidebar with:
  - Recent Lectures
  - Knowledge Graph
  - Settings
- Main workspace with:
  - Header + Network Mode toggle
  - Player section
  - Transformation tabs

### Transformation Tabs
- Notes: AI-style markdown notes view
- Diagrams: Mermaid flowchart rendering container
- Flashcards: Click-to-flip card grid
- Quiz: Radio-button quiz interface with correctness feedback

### Scalability Toggle (Network Mode)
- Normal Mode: Video player shown
- Adaptive Mode: Low-bandwidth panel with:
  - AI-generated SVG summary visual
  - Transcript-only compressed text

### API Placeholder
- `POST /api/transform`
- Accepts transcript text and returns mock:
  - summary
  - mermaidCode
  - notes
  - quiz array

## Project Structure

```text
src/
  app/
    api/transform/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    dashboard/
      dashboard-shell.tsx
      sidebar.tsx
      player-panel.tsx
      low-bandwidth-placeholder.tsx
      transformation-tabs.tsx
      notes-panel.tsx
      diagrams-panel.tsx
      flashcards-panel.tsx
      quiz-panel.tsx
    ui/
      tabs.tsx
      switch.tsx
      radio-group.tsx
  lib/
    utils.ts
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open http://localhost:3000

### 3. Production build check

```bash
npm run build
```

## VS Code Tasks

Workspace tasks are configured in `.vscode/tasks.json`:
- SLATE: Install Dependencies
- SLATE: Run Dev Server
- SLATE: Build

Run via Command Palette -> Tasks: Run Task.

## Git + Collaboration

- Default branch: `main`
- Recommended branching format:
  - `feature/<name>-<task>`
  - `fix/<name>-<issue>`

Suggested team flow:
1. Pull latest `main`
2. Create feature branch
3. Commit in small chunks
4. Open PR to `main`
5. One teammate reviews before merge

## Demo Script (90 seconds)

1. Open dashboard and explain network mode toggle
2. Show Normal Mode lecture player
3. Switch to Adaptive Mode for low-bandwidth summary
4. Walk through Notes -> Diagrams -> Flashcards -> Quiz
5. Call out transform API response powering outputs
6. End with scalability + learning impact

## Roadmap (Next Priority)

1. Wire tabs to live data from `/api/transform`
2. Add loading/error/empty states
3. Integrate Supabase auth + lecture persistence
4. Populate Recent Lectures from database
5. Add export (markdown notes) and quiz regeneration

## Team Roles (Suggested)

- Member 1: API orchestration + state wiring
- Member 2: Supabase schema + CRUD integration
- Member 3: Adaptive mode polish + performance metrics
- Member 4: QA, demo content, pitch flow, fallback data

## Notes

This repository currently uses mock transformation output for rapid hackathon iteration. Supabase and model-backed transformation can be integrated incrementally without changing the dashboard information architecture.
