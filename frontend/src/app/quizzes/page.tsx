import { QuizList } from '@/components/quizzes/QuizList';

export default function QuizzesPage() {
  return (
    <>
      <header className="pageHeader">
        <h1>All Quizzes</h1>
        <p>Browse your quizzes or create a new one.</p>
      </header>
      <div className="pageContent">
        <QuizList />
      </div>
    </>
  );
}
