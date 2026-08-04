# Quiz Builder

Full-Stack JS engineer test assessment — a web app for creating and browsing custom quizzes.

Users can build quizzes with multiple question types, view all quizzes on a dashboard, and open any quiz in read-only detail. This is a **quiz authoring** tool — there are no correct answers and no quiz-taking flow.

## Tech stack

| Layer | Technology |
|-------|------------|
| Backend | Nest.js, TypeScript, PostgreSQL, Prisma |
| Frontend | Next.js (App Router), TypeScript, SCSS, React Hook Form |
| Tooling | ESLint, Prettier |

## Project structure

```
/
├── backend/     Nest.js REST API + Prisma
├── frontend/    Next.js UI
└── docs/        Project requirements
```

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm

## Database setup

1. Start PostgreSQL locally.

2. Create the database:

```sql
CREATE DATABASE quiz_builder;
```

3. From the `backend` directory, run migrations:

```bash
cd backend
npm install
npx prisma migrate dev
```

## Environment configuration

Create local env files (these are gitignored — do not commit them).

**`backend/.env`**

```env
DATABASE_URL="postgresql://your_user@localhost:5432/quiz_builder?schema=public"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Replace `your_user` with your PostgreSQL username. Adjust the connection string if your setup differs.

## Start the application

Open two terminals.

**Backend** (http://localhost:3001):

```bash
cd backend
npm install
npm run start:dev
```

**Frontend** (http://localhost:3000):

```bash
cd frontend
npm install
npm run dev
```

## Create a sample quiz

### Option A — Seed script

From the `backend` directory:

```bash
npm run prisma:seed
```

This inserts a sample quiz with all three question types (Boolean, Input, Checkbox). Open http://localhost:3000/quizzes to view it.

### Option B — UI

1. Open http://localhost:3000/create
2. Enter a quiz title
3. Add one or more questions:
   - **True / False** — question text only
   - **Short text** — question text only
   - **Multiple choice** — question text + at least 2 options
4. Click **Create quiz**

### Option C — API

```bash
curl -X POST http://localhost:3001/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Quiz",
    "questions": [
      { "text": "The sky is blue.", "type": "BOOLEAN", "order": 0 },
      { "text": "What is your favorite color?", "type": "INPUT", "order": 1 },
      {
        "text": "Select all programming languages you know:",
        "type": "CHECKBOX",
        "order": 2,
        "options": ["JavaScript", "Python", "Rust", "Go"]
      }
    ]
  }'
```

## Frontend pages

| Route | Description |
|-------|-------------|
| `/create` | Create a new quiz |
| `/quizzes` | List all quizzes (title + question count) |
| `/quizzes/:id` | View quiz detail (read-only) |

## API endpoints

Base path: `/api/quizzes`

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/quizzes` | Create a new quiz |
| GET | `/api/quizzes` | List all quizzes |
| GET | `/api/quizzes/:id` | Get quiz details |
| DELETE | `/api/quizzes/:id` | Delete a quiz |

## Scripts

### Backend (`backend/`)

```bash
npm run start:dev       # Development server
npm run build           # Production build
npm run lint            # ESLint
npm run format          # Prettier
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio
npm run prisma:seed     # Seed sample quiz
```

### Frontend (`frontend/`)

```bash
npm run dev             # Development server
npm run build           # Production build
npm run lint            # ESLint
npm run format          # Prettier
```

## Code quality

Both packages use ESLint and Prettier. Run lint and format in each directory before submitting:

```bash
cd backend && npm run lint && npm run format
cd frontend && npm run lint && npm run format
```
