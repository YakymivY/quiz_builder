import { QuizDetailView } from '@/components/quizzes/QuizDetail';

interface QuizDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;

  return (
    <>
      <header className="pageHeader">
        <h1>Quiz Detail</h1>
        <p>Read-only view of quiz structure (ID: {id}).</p>
      </header>
      <div className="pageContent">
        <QuizDetailView />
      </div>
    </>
  );
}
