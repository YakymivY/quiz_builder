# Quiz Builder — Requirements & Instructions

> Consolidated specification for the [Develops Today Full-Stack JS assessment](https://develops.notion.site/Full-Stack-JS-engineer-test-assessment-the-Quiz-Builder-2160fe54b07b80cb9a5ec4cd6ab51957), with project-specific decisions applied.

---

## 1. Overview

Build a full-stack **Quiz Builder** web application where users can create custom quizzes with various question types, browse all quizzes on a dashboard, and view individual quizzes in read-only detail.

This is a **quiz authoring** tool, not a quiz-taking/scoring app. There are **no correct answers** — neither at creation nor on the detail page.

### Core user flows

1. Create a quiz with a title and one or more questions
2. View a list of all quizzes (title + question count)
3. Open a quiz detail page (read-only structure view)
4. Delete a quiz from the list

---

## 2. Tech stack

| Layer                | Choice                                                                            |
| -------------------- | --------------------------------------------------------------------------------- |
| Backend framework    | **Nest.js**                                                                       |
| Backend language     | TypeScript                                                                        |
| Database             | **PostgreSQL**                                                                    |
| ORM                  | **Prisma**                                                                        |
| Frontend framework   | **Next.js** (App Router)                                                          |
| Frontend language    | TypeScript                                                                        |
| Styling              | **SCSS** (CSS Modules or global partials — pick one approach and stay consistent) |
| Forms                | **React Hook Form**                                                               |
| Linting / formatting | ESLint + Prettier (both frontend and backend)                                     |
| Environment config   | `.env` files (never committed)                                                    |

### Default ports

| Service            | Port   |
| ------------------ | ------ |
| Frontend (Next.js) | `3000` |
| Backend (Nest.js)  | `3001` |

---

## 3. Repository structure

```
/
├── docs/                  # This documentation
├── backend/               # Nest.js + Prisma API
│   ├── prisma/
│   ├── src/
│   └── .env.example
├── frontend/              # Next.js app
│   ├── src/
│   └── .env.example
├── .gitignore
└── README.md              # Root setup guide (optional; at minimum backend + frontend READMEs)
```

Deliverables per the assessment:

- `/frontend` and `/backend` directories
- Working local project with functioning API and UI
- Optional seed script or sample quiz

---

## 4. API specification

Base path: **`/api/quizzes`**

All endpoints return JSON. Use conventional HTTP status codes (`201`, `200`, `404`, `400`, etc.).

### 4.1 `POST /api/quizzes` — Create quiz

**Request body:**

```json
{
  "title": "My Quiz",
  "questions": [
    {
      "text": "The sky is blue.",
      "type": "BOOLEAN",
      "order": 0
    },
    {
      "text": "What is your favorite color?",
      "type": "INPUT",
      "order": 1
    },
    {
      "text": "Select all programming languages you know:",
      "type": "CHECKBOX",
      "order": 2,
      "options": ["JavaScript", "Python", "Rust", "Go"]
    }
  ]
}
```

**Response:** `201 Created` — full quiz object including generated IDs.

### 4.2 `GET /api/quizzes` — List quizzes

**Response:** `200 OK`

```json
[
  {
    "id": "uuid",
    "title": "My Quiz",
    "questionCount": 3
  }
]
```

Return title and number of questions only (not full question payloads).

### 4.3 `GET /api/quizzes/:id` — Quiz detail

**Response:** `200 OK` — full quiz with all questions and their structure.

```json
{
  "id": "uuid",
  "title": "My Quiz",
  "questions": [
    {
      "id": "uuid",
      "text": "The sky is blue.",
      "type": "BOOLEAN",
      "order": 0
    },
    {
      "id": "uuid",
      "text": "What is your favorite color?",
      "type": "INPUT",
      "order": 1
    },
    {
      "id": "uuid",
      "text": "Select all programming languages you know:",
      "type": "CHECKBOX",
      "order": 2,
      "options": ["JavaScript", "Python", "Rust", "Go"]
    }
  ]
}
```

**404** if quiz not found.

### 4.4 `DELETE /api/quizzes/:id` — Delete quiz

**Response:** `200 OK` or `204 No Content`

**404** if quiz not found.

Deleting a quiz should cascade-delete its questions (and checkbox options if stored separately).

### 4.5 CORS

Enable CORS on the backend so the Next.js frontend (`localhost:3000`) can call the API.

---

## 5. Data model

### 5.1 Question types

| Type     | Enum value | Creation fields     | Detail view (read-only)                                  |
| -------- | ---------- | ------------------- | -------------------------------------------------------- |
| Boolean  | `BOOLEAN`  | `text`              | Question text + True / False indicators (structure only) |
| Input    | `INPUT`    | `text`              | Question text + short-text input placeholder (disabled)  |
| Checkbox | `CHECKBOX` | `text`, `options[]` | Question text + list of checkbox options (unchecked)     |

**No correct answers** are stored or displayed for any type.

### 5.2 Suggested Prisma schema (starting point)

```
Quiz
  id          String   @id @default(uuid())
  title       String
  createdAt   DateTime @default(now())
  questions   Question[]

Question
  id          String       @id @default(uuid())
  quizId      String
  quiz        Quiz         @relation(...)
  text        String
  type        QuestionType
  order       Int
  options     QuestionOption[]   // only for CHECKBOX

QuestionOption
  id          String   @id @default(uuid())
  questionId  String
  question    Question @relation(...)
  label       String
  order       Int

enum QuestionType {
  BOOLEAN
  INPUT
  CHECKBOX
}
```

Options for CHECKBOX can also be stored as a JSON column on `Question` if that keeps the schema simpler — choose one approach and document it in the backend README.

### 5.3 Ordering

Questions have an explicit `order` field (0-based). Preserve order in list and detail responses.

---

## 6. Validation rules

### From the assessment

- Quiz must have a **title**
- Quiz must have **one or more questions**
- Each question must have **text** and a **type**

### Additional obvious rules

| Rule                                                     | Applies to |
| -------------------------------------------------------- | ---------- |
| Title must not be empty / whitespace-only                | Quiz       |
| Question text must not be empty / whitespace-only        | Question   |
| CHECKBOX type must have **at least 2 options**           | Question   |
| Each CHECKBOX option must not be empty / whitespace-only | Option     |
| BOOLEAN and INPUT types must **not** include options     | Question   |
| Unknown question types rejected                          | Question   |

No other validation requirements (no max lengths, no duplicate-title checks, no min/max question counts beyond ≥ 1).

Validate on the backend. Mirror validation in React Hook Form on the frontend for immediate feedback.

---

## 7. Frontend pages

### 7.1 `/create` — Quiz creation

**Form fields:**

- Quiz title (text input)
- Dynamic question list with add / remove controls

**Per question:**

| Field                        | All types | BOOLEAN | INPUT | CHECKBOX |
| ---------------------------- | --------- | ------- | ----- | -------- |
| Question text                | ✓         |         |       |          |
| Type selector                | ✓         |         |       |          |
| Options (dynamic add/remove) |           |         |       | ✓        |

**Submit:** `POST /api/quizzes` → redirect to `/quizzes` or `/quizzes/:id` on success.

**UX notes:**

- At least one question row visible by default
- Removing a question updates order indices before submit
- Type change clears incompatible fields (e.g. switching away from CHECKBOX removes options)

### 7.2 `/quizzes` — Quiz list (dashboard)

- Fetch `GET /api/quizzes`
- Display each quiz: **title** + **question count**
- Each row links to `/quizzes/:id`
- Each row has a **delete icon/button**
  - Click → `DELETE /api/quizzes/:id` → remove from list immediately
  - **No confirmation dialog**

### 7.3 `/quizzes/:id` — Quiz detail

- Fetch `GET /api/quizzes/:id`
- Display quiz title and all questions in **read-only** mode
- Render by type:
  - **BOOLEAN:** question text + disabled True / False radio group
  - **INPUT:** question text + disabled text input
  - **CHECKBOX:** question text + disabled checkboxes for each option
- **Do not show, store, or hint at correct answers**

### 7.4 Navigation

Provide consistent navigation between the three pages (e.g. header or nav bar with links to Create and Quizzes list).

---

## 8. Design & UX guidelines

### Design direction

- **Not default-looking** — avoid generic out-of-the-box component-library aesthetics (plain white cards, default blue buttons, etc.)
- **Consistent UX** — same spacing scale, typography, colors, and interaction patterns across all pages
- **Mobile responsive** (assessment lists this as a plus — implement it)

### Suggested approach

- Define SCSS variables/partials for colors, spacing, typography, and breakpoints
- Use a deliberate color palette and font pairing (e.g. via `next/font` or a single web font)
- Consistent button styles, form field styles, and card/list item patterns
- Thoughtful empty states (e.g. "No quizzes yet" on `/quizzes` with a link to `/create`)

### Error & loading UI

No specific requirements beyond what the assessment implies:

- Show meaningful feedback when API calls fail (inline message or toast — pick one and stay consistent)
- Show loading state while fetching lists or details (spinner or skeleton — keep it simple)

---

## 9. Environment configuration

### Backend `.env` (example)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/quiz_builder"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### Frontend `.env` (example)

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Rules

- Provide `.env.example` files in both `/backend` and `/frontend`
- Add `.env` to `.gitignore`
- Never commit secrets or local database credentials

---

## 10. Code quality

- ESLint + Prettier configured in both packages
- Run lint and format before considering work complete
- Modular structure:
  - Backend: modules, controllers, services, DTOs
  - Frontend: pages/routes, components, API service layer, shared types
- TypeScript strict mode recommended

---

## 11. README requirements

Each package (and optionally the root) should describe:

1. Prerequisites (Node.js version, PostgreSQL)
2. How to install dependencies
3. How to set up the database (create DB, run Prisma migrate)
4. How to start backend and frontend in development
5. How to create a sample quiz (manual steps or seed script)

---

## 12. Out of scope

Do **not** implement unless explicitly requested later:

- User authentication / authorization
- Edit / update existing quizzes or questions
- Quiz taking, scoring, or results
- Correct answer storage or display
- Delete confirmation dialogs
- Pagination, search, or filtering
- Docker / deployment configuration
- Automated tests (unless added voluntarily)

---

## 13. Implementation checklist

### Backend

- [ ] Nest.js project scaffold in `/backend`
- [ ] Prisma schema + initial migration
- [ ] Quiz module with CRUD endpoints under `/api/quizzes`
- [ ] DTO validation (class-validator or similar)
- [ ] CORS enabled
- [ ] ESLint + Prettier
- [ ] `.env.example`
- [ ] Backend README

### Frontend

- [ ] Next.js project scaffold in `/frontend`
- [ ] SCSS setup (modules or global — document choice)
- [ ] API client/service layer
- [ ] `/create` page with React Hook Form + dynamic questions
- [ ] `/quizzes` list page with delete
- [ ] `/quizzes/[id]` detail page (read-only, no correct answers)
- [ ] Consistent navigation and responsive layout
- [ ] ESLint + Prettier
- [ ] `.env.example`
- [ ] Frontend README

### Optional

- [ ] Prisma seed script with a sample quiz
- [ ] Root README linking both packages

---

## 14. Quick reference — question type behavior

```
BOOLEAN   → Creator enters question text only.
            Detail page shows True / False radios (disabled).

INPUT     → Creator enters question text only.
            Detail page shows a disabled text input.

CHECKBOX  → Creator enters question text + dynamic options (min 2).
            Detail page shows disabled checkboxes for each option.
```

No `correctAnswer`, `isCorrect`, or equivalent fields anywhere in the stack.
