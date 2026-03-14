# SLATE API Contract (v1)

This contract is the single source of truth between frontend, backend, and data teams.

## Response Envelope

All endpoints should return the same envelope shape.

```ts
{
  success: boolean;
  data?: unknown;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

## 1) Create Lecture

`POST /api/lectures`

Create a lecture record before transcription/transformation.

Request:

```json
{
  "title": "Neural Networks - Lecture 1",
  "sourceType": "audio",
  "audioPath": "lecture-audio/user-123/nn-1.mp3",
  "language": "en",
  "networkMode": "normal"
}
```

Response (`201`):

```json
{
  "success": true,
  "data": {
    "id": "f2d2af4a-3769-477f-bf26-62195de45b1a",
    "title": "Neural Networks - Lecture 1",
    "status": "uploaded",
    "createdAt": "2026-03-14T12:34:56.000Z"
  }
}
```

## 2) Transcribe Audio

`POST /api/transcribe`

Request:

```json
{
  "lectureId": "f2d2af4a-3769-477f-bf26-62195de45b1a",
  "audioPath": "lecture-audio/user-123/nn-1.mp3",
  "provider": "groq",
  "language": "en"
}
```

Response (`200`):

```json
{
  "success": true,
  "data": {
    "lectureId": "f2d2af4a-3769-477f-bf26-62195de45b1a",
    "transcript": "Today we cover perceptrons and gradient descent...",
    "sttProvider": "groq",
    "durationSeconds": 532,
    "status": "transcribed"
  }
}
```

## 3) Transform Transcript

`POST /api/transform`

This route already exists; backend should align it to this request/response shape.

Request:

```json
{
  "lectureId": "f2d2af4a-3769-477f-bf26-62195de45b1a",
  "transcript": "Today we cover perceptrons and gradient descent...",
  "targetLanguage": "en",
  "networkMode": "adaptive",
  "provider": "github-models"
}
```

Response (`200`):

```json
{
  "success": true,
  "data": {
    "lectureId": "f2d2af4a-3769-477f-bf26-62195de45b1a",
    "summary": "Lecture introduces perceptrons, loss functions, and optimization.",
    "notes": "# Notes\n- Perceptron basics\n- Loss and gradients",
    "mermaidCode": "flowchart TD\nA[Input]-->B[Perceptron]",
    "quiz": [
      {
        "id": "q1",
        "prompt": "What does learning rate control?",
        "options": ["Step size", "Batch size", "Epoch count", "Memory"],
        "answer": "Step size"
      }
    ],
    "flashcards": [
      {
        "id": "f1",
        "front": "Perceptron",
        "back": "A linear binary classifier"
      }
    ],
    "status": "transformed"
  }
}
```

## 4) List Lectures

`GET /api/lectures?limit=20&offset=0`

Response (`200`):

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "f2d2af4a-3769-477f-bf26-62195de45b1a",
        "title": "Neural Networks - Lecture 1",
        "status": "transformed",
        "createdAt": "2026-03-14T12:34:56.000Z"
      }
    ],
    "total": 1
  }
}
```

## 5) Get Lecture Detail

`GET /api/lectures/:id`

Response (`200`):

```json
{
  "success": true,
  "data": {
    "id": "f2d2af4a-3769-477f-bf26-62195de45b1a",
    "title": "Neural Networks - Lecture 1",
    "transcript": "...",
    "output": {
      "summary": "...",
      "notes": "...",
      "mermaidCode": "...",
      "quiz": [],
      "flashcards": []
    }
  }
}
```

## Error Codes

Use stable `error.code` values:
- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `NOT_FOUND`
- `RATE_LIMITED`
- `UPSTREAM_PROVIDER_ERROR`
- `INTERNAL_ERROR`
