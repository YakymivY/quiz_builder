# Quiz Builder — Backend

Nest.js REST API with Prisma and PostgreSQL.

## Setup

1. Copy environment file:

```bash
cp .env.example .env
```

2. Ensure PostgreSQL is running and the `quiz_builder` database exists.

3. Install and migrate:

```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
```

4. Start development server:

```bash
npm run start:dev
```

Server: **http://localhost:3001**

## Environment variables

| Variable       | Description                  | Default                 |
| -------------- | ---------------------------- | ----------------------- |
| `DATABASE_URL` | PostgreSQL connection string | see `.env.example`      |
| `PORT`         | Server port                  | `3001`                  |
| `CORS_ORIGIN`  | Allowed frontend origin      | `http://localhost:3000` |

## API

Base path: `/api/quizzes`

Routes are wired in `src/quizzes/`. Service methods are stubs — implement CRUD logic in `quizzes.service.ts`.

## Prisma

```bash
npm run prisma:migrate   # Apply migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Insert sample quiz
```

Schema: `prisma/schema.prisma`

Models: `Quiz`, `Question`, `QuestionOption`

## Scripts

```bash
npm run start:dev
npm run build
npm run lint
npm run format
```
