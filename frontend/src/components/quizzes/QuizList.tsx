'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { QuizListItem } from '@/types/quiz';
import styles from './QuizList.module.scss';

export function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuizzes();
  }, [loadQuizzes]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);

    try {
      await api.deleteQuiz(id);
      setQuizzes((current) => current.filter((quiz) => quiz.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quiz');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className={styles.status}>Loading quizzes…</p>;
  }

  if (error && quizzes.length === 0) {
    return (
      <div className="emptyState">
        <p>{error}</p>
        <button type="button" className="btnSecondary" onClick={loadQuizzes}>
          Try again
        </button>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="emptyState">
        <p>No quizzes yet. Create your first one to get started.</p>
        <Link href="/create" className="btnPrimary">
          Create quiz
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {error && <p className={styles.error}>{error}</p>}

      <ul className={styles.list}>
        {quizzes.map((quiz) => (
          <li key={quiz.id} className={styles.item}>
            <Link href={`/quizzes/${quiz.id}`} className={styles.link}>
              <span className={styles.title}>{quiz.title}</span>
              <span className={styles.meta}>
                {quiz.questionCount}{' '}
                {quiz.questionCount === 1 ? 'question' : 'questions'}
              </span>
            </Link>

            <button
              type="button"
              className="btnDanger"
              aria-label={`Delete ${quiz.title}`}
              disabled={deletingId === quiz.id}
              onClick={() => void handleDelete(quiz.id)}
            >
              {deletingId === quiz.id ? '…' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
