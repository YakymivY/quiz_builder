'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { QuizDetail } from '@/types/quiz';
import { QuestionPreview } from './QuestionPreview';
import styles from './QuizDetail.module.scss';

interface QuizDetailViewProps {
  id: string;
}

export function QuizDetailView({ id }: QuizDetailViewProps) {
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuiz() {
      setLoading(true);
      setError(null);

      try {
        const data = await api.getQuiz(id);
        if (!cancelled) {
          setQuiz(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load quiz');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className={styles.status}>Loading quiz…</p>;
  }

  if (error || !quiz) {
    return (
      <div className="emptyState">
        <p>{error ?? 'Quiz not found'}</p>
        <Link href="/quizzes" className="btnSecondary">
          Back to all quizzes
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{quiz.title}</h1>
          <p className={styles.meta}>
            {quiz.questions.length}{' '}
            {quiz.questions.length === 1 ? 'question' : 'questions'}
          </p>
        </div>
        <Link href="/quizzes" className="btnSecondary">
          Back to list
        </Link>
      </header>

      <div className={styles.questions}>
        {quiz.questions.map((question, index) => (
          <QuestionPreview
            key={question.id}
            question={question}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
