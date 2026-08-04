# Quiz Builder

Full-stack quiz creation app — Nest.js API + Next.js frontend.

See [docs/requirements.md](./docs/requirements.md) for the full specification.

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm

## Quick start

### 1. Create the database (manual)

Connect to PostgreSQL and run:

```sql
CREATE DATABASE quiz_builder;
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env` with your local PostgreSQL user (no password needed if your local setup uses peer/trust auth):

```env
DATABASE_URL="postgresql://your_user@localhost:5432/quiz_builder?schema=public"
```

`.env` is gitignored — never commit real credentials. `.env.example` only documents which variables are required.

### 3. Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```

API runs at **http://localhost:3001**

Optional — seed sample data:

```bash
npx prisma db seed
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**

## Project structure

```
├── backend/          Nest.js + Prisma + PostgreSQL
├── frontend/         Next.js + SCSS + React Hook Form
├── docs/             Requirements & development instructions
└── README.md
```

## API endpoints

| Method | Route              | Description  |
| ------ | ------------------ | ------------ |
| POST   | `/api/quizzes`     | Create quiz  |
| GET    | `/api/quizzes`     | List quizzes |
| GET    | `/api/quizzes/:id` | Quiz detail  |
| DELETE | `/api/quizzes/:id` | Delete quiz  |

## Scripts

### Backend

```bash
npm run start:dev      # Dev server
npm run lint           # ESLint
npm run format         # Prettier
npm run prisma:migrate # Run migrations
npm run prisma:studio  # Database UI
npm run prisma:seed    # Seed sample quiz
```

### Frontend

```bash
npm run dev            # Dev server
npm run build          # Production build
npm run lint           # ESLint
npm run format         # Prettier
```

## Git note

`create-next-app` initialized a git repo inside `frontend/`. For a single repo at the project root, remove it:

```bash
rm -rf frontend/.git
git init
```
