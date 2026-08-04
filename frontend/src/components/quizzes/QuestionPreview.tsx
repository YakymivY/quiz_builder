import type { Question } from '@/types/quiz';
import styles from './QuestionPreview.module.scss';

interface QuestionPreviewProps {
  question: Question;
  index: number;
}

export function QuestionPreview({ question, index }: QuestionPreviewProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.number}>Q{index + 1}</span>
        <span className={styles.type}>{formatType(question.type)}</span>
      </header>

      <p className={styles.text}>{question.text}</p>

      {question.type === 'BOOLEAN' && <BooleanPreview />}
      {question.type === 'INPUT' && <InputPreview />}
      {question.type === 'CHECKBOX' && (
        <CheckboxPreview options={question.options ?? []} />
      )}
    </article>
  );
}

function formatType(type: Question['type']) {
  switch (type) {
    case 'BOOLEAN':
      return 'True / False';
    case 'INPUT':
      return 'Short text';
    case 'CHECKBOX':
      return 'Multiple choice';
  }
}

function BooleanPreview() {
  return (
    <div className={styles.previewGroup} aria-hidden="true">
      <label className={styles.previewOption}>
        <input type="radio" disabled />
        <span>True</span>
      </label>
      <label className={styles.previewOption}>
        <input type="radio" disabled />
        <span>False</span>
      </label>
    </div>
  );
}

function InputPreview() {
  return (
    <input
      className="input"
      type="text"
      disabled
      placeholder="Short answer"
      aria-hidden="true"
    />
  );
}

function CheckboxPreview({ options }: { options: string[] }) {
  return (
    <div className={styles.previewGroup} aria-hidden="true">
      {options.map((option) => (
        <label key={option} className={styles.previewOption}>
          <input type="checkbox" disabled />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}
