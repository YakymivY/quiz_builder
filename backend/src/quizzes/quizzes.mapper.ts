import { Question, QuestionOption, QuestionType, Quiz } from '@prisma/client';

type QuestionWithOptions = Question & { options: QuestionOption[] };

export type QuizWithQuestions = Quiz & {
  questions: QuestionWithOptions[];
};

export function mapQuestion(question: QuestionWithOptions) {
  const base = {
    id: question.id,
    text: question.text,
    type: question.type,
    order: question.order,
  };

  if (question.type === QuestionType.CHECKBOX) {
    return {
      ...base,
      options: question.options.map((option) => option.label),
    };
  }

  return base;
}

export function mapQuizDetail(quiz: QuizWithQuestions) {
  return {
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions.map(mapQuestion),
  };
}
