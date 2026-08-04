export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface QuizListItem {
  id: string;
  title: string;
  questionCount: number;
}

export interface QuestionOption {
  id: string;
  label: string;
  order: number;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
  options?: QuestionOption[];
}

export interface QuizDetail {
  id: string;
  title: string;
  questions: Question[];
}

export interface CreateQuestionPayload {
  text: string;
  type: QuestionType;
  order: number;
  options?: string[];
}

export interface CreateQuizPayload {
  title: string;
  questions: CreateQuestionPayload[];
}
