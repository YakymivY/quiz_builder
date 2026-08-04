# Quiz Builder — Development Instructions

Step-by-step guide for building the project defined in [requirements.md](./requirements.md).

---

## Phase 0 — Prerequisites

Install locally:

- **Node.js** 20+ (LTS)
- **PostgreSQL** 14+
- **npm** or **pnpm** (pick one; use consistently)

Create a PostgreSQL database:

```sql
CREATE DATABASE quiz_builder;
```

---

## Phase 1 — Backend setup

### 1.1 Scaffold Nest.js

```bash
cd backend
npx @nestjs/cli new . --package-manager npm --strict
```

Install dependencies:

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

### 1.2 Configure Prisma

1. Set `DATABASE_URL` in `backend/.env`
2. Define models per [requirements.md §5.2](./requirements.md#52-suggested-prisma-schema-starting-point)
3. Run migration:

```bash
npx prisma migrate dev --name init
```

### 1.3 Nest.js module structure

Suggested layout:

```
backend/src/
├── main.ts                 # Bootstrap, CORS, global prefix /api
├── app.module.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
└── quizzes/
    ├── quizzes.module.ts
    ├── quizzes.controller.ts
    ├── quizzes.service.ts
    └── dto/
        ├── create-quiz.dto.ts
        ├── create-question.dto.ts
        └── question-type.enum.ts
```

### 1.4 Controller routes

| Method | Route              | Handler     |
| ------ | ------------------ | ----------- |
| POST   | `/api/quizzes`     | `create()`  |
| GET    | `/api/quizzes`     | `findAll()` |
| GET    | `/api/quizzes/:id` | `findOne()` |
| DELETE | `/api/quizzes/:id` | `remove()`  |

Register global prefix in `main.ts`:

```typescript
app.setGlobalPrefix("api");
```

Enable CORS for `http://localhost:3000`.

### 1.5 Validation

Use Nest.js `ValidationPipe` globally with `class-validator` DTOs:

- `CreateQuizDto`: `title` (non-empty string), `questions` (array, min length 1)
- `CreateQuestionDto`: `text`, `type` (enum), `order`, optional `options` (required when type is CHECKBOX, min 2 items)

### 1.6 Service logic notes

- **create:** persist quiz + questions (+ options for CHECKBOX) in a transaction
- **findAll:** return `{ id, title, questionCount }` — use `_count` or map
- **findOne:** include questions ordered by `order`; include options for CHECKBOX
- **remove:** delete by id; return 404 if missing

### 1.7 Tooling

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier
# Configure per Nest.js + Prettier conventions
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "start:dev": "nest start --watch",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

Copy `backend/.env` → `backend/.env.example` with placeholder values.

---

## Phase 2 — Frontend setup

### 2.1 Scaffold Next.js

```bash
cd frontend
npx create-next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --import-alias "@/*"
```

### 2.2 SCSS setup

Next.js supports SCSS out of the box:

```bash
npm install sass
```

Organize styles:

```
frontend/src/styles/
├── _variables.scss      # colors, spacing, fonts, breakpoints
├── _mixins.scss         # responsive helpers, focus rings, etc.
├── _typography.scss
├── _forms.scss
├── _buttons.scss
└── globals.scss         # imports all partials; imported in layout.tsx
```

Use CSS Modules (`*.module.scss`) for component-scoped styles where appropriate.

### 2.3 Project structure

```
frontend/src/
├── app/
│   ├── layout.tsx              # Root layout, nav, global styles
│   ├── page.tsx                # Redirect to /quizzes or landing
│   ├── create/
│   │   └── page.tsx
│   └── quizzes/
│       ├── page.tsx
│       └── [id]/
│           └── page.tsx
├── components/
│   ├── layout/
│   │   └── Navigation.tsx
│   ├── quizzes/
│   │   ├── QuizList.tsx
│   │   ├── QuizListItem.tsx
│   │   └── QuizDetail.tsx
│   └── create/
│       ├── CreateQuizForm.tsx
│       ├── QuestionField.tsx
│       └── CheckboxOptionsField.tsx
├── lib/
│   └── api.ts                  # fetch wrapper for /api/quizzes
└── types/
    └── quiz.ts                 # shared TS types mirroring API
```

### 2.4 API client

Create `lib/api.ts`:

```typescript
const BASE = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  getQuizzes: () => fetch(`${BASE}/api/quizzes`).then((res) => res.json()),
  getQuiz: (id: string) =>
    fetch(`${BASE}/api/quizzes/${id}`).then((res) => res.json()),
  createQuiz: (body: CreateQuizPayload) =>
    fetch(`${BASE}/api/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  deleteQuiz: (id: string) =>
    fetch(`${BASE}/api/quizzes/${id}`, { method: "DELETE" }),
};
```

Handle non-OK responses with thrown errors or a small result type.

### 2.5 Forms — `/create`

Install:

```bash
npm install react-hook-form
```

**Form shape:**

```typescript
interface CreateQuizFormValues {
  title: string;
  questions: {
    text: string;
    type: "BOOLEAN" | "INPUT" | "CHECKBOX";
    options?: string[];
  }[];
}
```

Use `useFieldArray` for dynamic questions.

**Validation (React Hook Form rules):**

- `title`: required
- `questions`: min 1 entry
- `questions.*.text`: required
- `questions.*.type`: required
- `questions.*.options`: required + min length 2 when type is CHECKBOX; each option non-empty

On submit, map to API payload with `order` indices and POST.

### 2.6 Pages

| Route           | Data fetching                  | Key behavior                  |
| --------------- | ------------------------------ | ----------------------------- |
| `/quizzes`      | Client or server fetch of list | Links + delete icon           |
| `/quizzes/[id]` | Fetch by id                    | Read-only question renderers  |
| `/create`       | None                           | Form submit → POST → redirect |

For delete on `/quizzes`: call DELETE, then filter item out of local state (optimistic or after success — either is fine).

### 2.7 Read-only question components

Build three small presentational components:

- `BooleanQuestionPreview` — disabled radio group (True / False)
- `InputQuestionPreview` — disabled `<input type="text">`
- `CheckboxQuestionPreview` — disabled checkboxes from `options[]`

No correct-answer highlighting.

### 2.8 Design implementation tips

1. Define the palette in `_variables.scss` before building pages
2. Build shared `_buttons.scss` and `_forms.scss` first — reuse everywhere
3. Add a simple responsive nav (stack on mobile)
4. Use consistent max-width container (~960px) for content
5. Empty state on `/quizzes` when array is empty

### 2.9 Tooling

Configure Prettier alongside ESLint. Add format script:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "format": "prettier --write \"src/**/*.{ts,tsx,scss}\""
  }
}
```

Copy `frontend/.env.local` → `frontend/.env.example`.

---

## Phase 3 — Integration & verification

### 3.1 Start both services

Terminal 1:

```bash
cd backend && npm run start:dev
# → http://localhost:3001
```

Terminal 2:

```bash
cd frontend && npm run dev
# → http://localhost:3000
```

### 3.2 Manual test plan

| #   | Action                                        | Expected                                   |
| --- | --------------------------------------------- | ------------------------------------------ |
| 1   | Open `/quizzes` with empty DB                 | Empty state shown                          |
| 2   | Go to `/create`, submit empty form            | Validation errors                          |
| 3   | Create quiz with 1 BOOLEAN question           | Redirect; appears in list with count 1     |
| 4   | Open detail page                              | Title + disabled True/False radios         |
| 5   | Create quiz with INPUT + CHECKBOX (3 options) | Detail shows disabled input + 3 checkboxes |
| 6   | Delete a quiz from list                       | Row disappears; GET by id returns 404      |
| 7   | Resize to mobile width                        | Layout remains usable                      |
| 8   | Run lint + format on both packages            | No errors                                  |

### 3.3 Sample curl (backend-only check)

```bash
curl -X POST http://localhost:3001/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Quiz",
    "questions": [
      { "text": "TypeScript is a superset of JavaScript.", "type": "BOOLEAN", "order": 0 },
      { "text": "Name one JS framework.", "type": "INPUT", "order": 1 },
      {
        "text": "Which are frontend frameworks?",
        "type": "CHECKBOX",
        "order": 2,
        "options": ["React", "Express", "Vue", "NestJS"]
      }
    ]
  }'
```

---

## Phase 4 — Optional seed script

In `backend/prisma/seed.ts`, insert one quiz with all three question types.

Register in `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Run: `npx prisma db seed`

---

## Phase 5 — Submission prep

Since submission is handled manually, before pushing:

1. Run `npm run lint` and `npm run format` in both packages
2. Verify `.env` files are gitignored
3. Confirm `.env.example` files exist and are accurate
4. Update README(s) with setup steps
5. Remove any debug logs or placeholder content
6. Quick smoke test on a fresh clone (if possible)

---

## File checklist before done

```
docs/
  requirements.md       ✓
  instructions.md       ✓
backend/
  .env.example
  prisma/schema.prisma
  src/quizzes/...
frontend/
  .env.example
  src/app/create/page.tsx
  src/app/quizzes/page.tsx
  src/app/quizzes/[id]/page.tsx
  src/styles/...
.gitignore                # includes .env, node_modules, .next, dist
README.md                 # root or per-package
```
