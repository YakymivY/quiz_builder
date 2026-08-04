'use client';

import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import type { CreateQuizFormValues, QuestionType } from '@/types/quiz';
import styles from './QuestionField.module.scss';

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'BOOLEAN', label: 'True / False' },
  { value: 'INPUT', label: 'Short text' },
  { value: 'CHECKBOX', label: 'Multiple choice' },
];

interface QuestionFieldProps {
  index: number;
  register: UseFormRegister<CreateQuizFormValues>;
  control: Control<CreateQuizFormValues>;
  setValue: UseFormSetValue<CreateQuizFormValues>;
  errors: FieldErrors<CreateQuizFormValues>;
  canRemove: boolean;
  onRemove: () => void;
  onTypeChange: (type: QuestionType) => void;
}

export function QuestionField({
  index,
  register,
  control,
  setValue,
  errors,
  canRemove,
  onRemove,
  onTypeChange,
}: QuestionFieldProps) {
  const type = useWatch({
    control,
    name: `questions.${index}.type`,
  });

  const options =
    useWatch({
      control,
      name: `questions.${index}.options`,
    }) ?? [];

  const questionErrors = errors.questions?.[index];

  const addOption = () => {
    setValue(`questions.${index}.options`, [...options, '']);
  };

  const removeOption = (optionIndex: number) => {
    setValue(
      `questions.${index}.options`,
      options.filter((_, currentIndex) => currentIndex !== optionIndex),
    );
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.number}>Question {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            className="btnDanger"
            onClick={onRemove}
            aria-label={`Remove question ${index + 1}`}
          >
            Remove
          </button>
        )}
      </header>

      <div className="field">
        <label className="label" htmlFor={`question-text-${index}`}>
          Question text
        </label>
        <input
          id={`question-text-${index}`}
          className="input"
          placeholder="Enter your question"
          {...register(`questions.${index}.text`, {
            required: 'Question text is required',
          })}
        />
        {questionErrors?.text && (
          <span className="error">{questionErrors.text.message}</span>
        )}
      </div>

      <div className="field">
        <label className="label" htmlFor={`question-type-${index}`}>
          Type
        </label>
        <select
          id={`question-type-${index}`}
          className="select"
          {...register(`questions.${index}.type`, {
            required: true,
            onChange: (event) =>
              onTypeChange(event.target.value as QuestionType),
          })}
        >
          {questionTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {type === 'CHECKBOX' && (
        <div className={styles.options}>
          <div className={styles.optionsHeader}>
            <span className="label">Options</span>
            <button
              type="button"
              className="btnSecondary"
              onClick={addOption}
            >
              + Add option
            </button>
          </div>

          {options.map((_, optionIndex) => (
            <div key={optionIndex} className={styles.optionRow}>
              <input
                className="input"
                placeholder={`Option ${optionIndex + 1}`}
                {...register(`questions.${index}.options.${optionIndex}`, {
                  required: 'Option cannot be empty',
                })}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  className="btnDanger"
                  onClick={() => removeOption(optionIndex)}
                  aria-label={`Remove option ${optionIndex + 1}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {questionErrors?.options && (
            <span className="error">
              {typeof questionErrors.options.message === 'string'
                ? questionErrors.options.message
                : 'Each option must be filled in'}
            </span>
          )}
        </div>
      )}

      {type === 'BOOLEAN' && (
        <p className={styles.hint}>Respondents will choose True or False.</p>
      )}

      {type === 'INPUT' && (
        <p className={styles.hint}>Respondents will enter a short text answer.</p>
      )}
    </article>
  );
}
