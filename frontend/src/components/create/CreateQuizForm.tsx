'use client';

import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import type { CreateQuizFormValues, QuestionType } from '@/types/quiz';
import { QuestionField } from './QuestionField';
import styles from './CreateQuizForm.module.scss';

const defaultQuestion = (): CreateQuizFormValues['questions'][number] => ({
  text: '',
  type: 'BOOLEAN',
  options: ['', ''],
});

export function CreateQuizForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateQuizFormValues>({
    defaultValues: {
      title: '',
      questions: [defaultQuestion()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (values: CreateQuizFormValues) => {
    setSubmitError(null);

    try {
      const quiz = await api.createQuiz({
        title: values.title.trim(),
        questions: values.questions.map((question, index) => ({
          text: question.text.trim(),
          type: question.type,
          order: index,
          ...(question.type === 'CHECKBOX'
            ? {
                options: question.options
                  .map((option) => option.trim())
                  .filter(Boolean),
              }
            : {}),
        })),
      });

      router.push(`/quizzes/${quiz.id}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to create quiz',
      );
    }
  };

  const handleTypeChange = (index: number, type: QuestionType) => {
    setValue(`questions.${index}.type`, type);

    if (type === 'CHECKBOX') {
      setValue(`questions.${index}.options`, ['', '']);
      return;
    }

    setValue(`questions.${index}.options`, []);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field">
        <label className="label" htmlFor="title">
          Quiz title
        </label>
        <input
          id="title"
          className="input"
          placeholder="e.g. JavaScript basics"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <span className="error">{errors.title.message}</span>
        )}
      </div>

      <section className={styles.questionsSection}>
        <div className={styles.questionsHeader}>
          <h2>Questions</h2>
          <button
            type="button"
            className="btnSecondary"
            onClick={() => append(defaultQuestion())}
          >
            + Add question
          </button>
        </div>

        <div className={styles.questionsList}>
          {fields.map((field, index) => (
            <QuestionField
              key={field.id}
              index={index}
              register={register}
              control={control}
              setValue={setValue}
              errors={errors}
              canRemove={fields.length > 1}
              onRemove={() => remove(index)}
              onTypeChange={(type) => handleTypeChange(index, type)}
            />
          ))}
        </div>
      </section>

      {submitError && <p className={styles.submitError}>{submitError}</p>}

      <div className={styles.actions}>
        <button
          type="submit"
          className="btnPrimary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating…' : 'Create quiz'}
        </button>
      </div>
    </form>
  );
}
