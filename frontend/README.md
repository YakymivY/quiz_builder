# Quiz Builder — Frontend

Next.js app with SCSS and React Hook Form.

## Setup

1. Copy environment file:

```bash
cp .env.example .env.local
```

2. Install and start:

```bash
npm install
npm run dev
```

App: **http://localhost:3000**

## Environment variables

| Variable              | Description      | Default                 |
| --------------------- | ---------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend base URL | `http://localhost:3001` |

## Pages

| Route           | File                    |
| --------------- | ----------------------- |
| `/`             | Redirects to `/quizzes` |
| `/quizzes`      | Quiz list               |
| `/quizzes/[id]` | Quiz detail (read-only) |
| `/create`       | Create quiz form        |

## Structure

```
src/
├── app/                 Next.js App Router pages
├── components/
│   ├── create/          Create quiz form (placeholder)
│   ├── layout/          Navigation
│   └── quizzes/         List & detail (placeholders)
├── lib/api.ts           API client
├── styles/              Global SCSS partials
└── types/quiz.ts        Shared TypeScript types
```

Components in `components/` are placeholders — connect them to the API client in the next development phase.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run format
```
