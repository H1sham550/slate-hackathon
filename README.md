# S.L.A.T.E.

Scalable Learning & Adaptive Text Engine

S.L.A.T.E. transforms lecture audio/transcripts into structured study materials that adapt to user constraints like bandwidth and readability.

## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Primitives: Radix-based components (Shadcn-style modular structure)
- Icons: lucide-react
- Diagrams: mermaid
- Planned Backend/Auth: Supabase

## Features

### Dashboard Layout
- Responsive sidebar (Recent Lectures, Knowledge Graph, Settings)
- Main workspace with header, media panel, and transformation tabs

### Transformation Tabs
- Notes: AI-style markdown notes view
- Diagrams: Mermaid flowchart rendering
- Flashcards: Click-to-flip card grid
- Quiz: Radio-button quiz with feedback

### Network Mode Toggle
- Normal Mode: video player
- Adaptive Mode: low-bandwidth panel with SVG summary and transcript

### Transform API
- `POST /api/transform`
- Accepts transcript text and returns mock `summary`, `mermaidCode`, `notes`, and `quiz`

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

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

Open http://localhost:3000

3. Build for production

```bash
npm run build
```

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server

## VS Code Tasks

Workspace tasks are configured in `.vscode/tasks.json`:
- SLATE: Install Dependencies
- SLATE: Run Dev Server
- SLATE: Build

Run via Command Palette -> Tasks: Run Task.

## Development Workflow

- Default branch: `main`
- Branch naming:
  - `feature/<name>-<task>`
  - `fix/<name>-<issue>`
- Open pull requests into `main`

## Notes

This repository currently uses mock transformation output for rapid hackathon iteration. Supabase and model-backed transformation can be integrated incrementally without changing the dashboard information architecture.
