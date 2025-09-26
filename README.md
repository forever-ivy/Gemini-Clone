# Gemini Clone (React + TypeScript + Vite)

A lightweight Gemini client built with React and TypeScript. It integrates Google Generative AI, renders answers in Markdown with syntax highlighting, and provides a clean chat experience with virtualized rendering and Tailwind + daisyUI styling.

## Features

- React 19 + TypeScript + Vite
- Google Gemini API integration via `@google/genai`
- Markdown rendering with GFM (tables, lists, checkboxes)
- Optional syntax highlighting for fenced code blocks
- Virtualized chat list for smooth scrolling
- Theme switching (light/dark) with daisyUI
- Local state via Zustand stores
- Local persistence (messages) via localStorage

## Tech Stack

- React, TypeScript, Vite
- Tailwind CSS, daisyUI
- react-markdown, remark-gfm, rehype-highlight, highlight.js
- Zustand (state management)
- @google/genai (Gemini API)
- ESLint

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

Create a `.env` file in the project root:
VITE_GEMINI_API_KEY=your_api_key_here

3. Run the dev server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

5. Preview the production build

```bash
npm run preview
```

## How It Works

- `chatpage.tsx`

  - Captures user input, toggles theme, and triggers API calls.
  - Uses `useGeminiAPI()` to call the Gemini model, streaming parts and writing them into `ResponseStore`.

- `config/gemini_2.5pro.ts`

  - Wraps `@google/genai` and writes outputs into `ResponseStore`:
    - `thoughtResponse` for model thoughts (optional)
    - `answerResponse` for final answer text

- `components/ChatList.tsx`

  - Maintains the message list, inserts a loading placeholder for AI, and replaces it when the API returns `answerResponse`.
  - Renders Markdown via `react-markdown` + `remark-gfm`. Code highlighting is applied only to fenced blocks with a language, to avoid over-highlighting plain text.
  - Uses localStorage to persist messages between refreshes.

- `lib/chatmessage.tsx`
  - Renders a single chat bubble (user/AI), including a collapsible helper block and visual alignment.

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — type-check and build production bundle
- `npm run preview` — preview the built app locally

## Environment

- API Key: Sign up for a Gemini API key and put it into `VITE_GEMINI_API_KEY`.
- Default model: `gemini-2.5-pro` (update in `config/gemini_2.5pro.ts` if needed).

## Markdown & Code Highlighting

- Fenced code blocks with a language get syntax highlighting, e.g.:

  ```ts
  export function add(a: number, b: number) {
    return a + b;
  }
  ```

- Inline code and blocks without a language are rendered as normal text to avoid accidental styling.

## Troubleshooting

- HTTP 429 (quota exceeded): Free tier daily quota for `gemini-2.5-pro` may be exhausted. Options:
  - wait for quota reset
  - upgrade to a paid plan
  - switch to a cheaper model for non-critical calls
  - add retry/backoff and UX fallbacks

