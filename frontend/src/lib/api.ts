import type {
  CreateQuizPayload,
  QuizDetail,
  QuizListItem,
} from '@/types/quiz';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function parseError(response: Response): Promise<string> {
  const fallback = `Request failed: ${response.status}`;
  const text = await response.text();

  if (!text) {
    return fallback;
  }

  try {
    const body = JSON.parse(text) as { message?: string | string[] };

    if (Array.isArray(body.message)) {
      return body.message.join(', ');
    }

    if (typeof body.message === 'string') {
      return body.message;
    }
  } catch {
    return text;
  }

  return fallback;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  getQuizzes: () => request<QuizListItem[]>('/api/quizzes'),
  getQuiz: (id: string) => request<QuizDetail>(`/api/quizzes/${id}`),
  createQuiz: (body: CreateQuizPayload) =>
    request<QuizDetail>('/api/quizzes', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  deleteQuiz: (id: string) =>
    request<void>(`/api/quizzes/${id}`, { method: 'DELETE' }),
};
