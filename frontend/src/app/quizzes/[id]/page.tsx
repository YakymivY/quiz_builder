import { QuizDetailView } from '@/components/quizzes/QuizDetail';

interface QuizDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;

  return (
    <div className="pageContent">
      <QuizDetailView id={id} />
    </div>
  );
}
