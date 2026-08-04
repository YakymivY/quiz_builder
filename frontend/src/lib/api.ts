import type {
  CreateQuizPayload,
  QuizDetail,
  QuizListItem,
} from '@/types/quiz';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
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
