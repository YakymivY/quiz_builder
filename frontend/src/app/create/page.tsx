import { CreateQuizForm } from '@/components/create/CreateQuizForm';

export default function CreatePage() {
  return (
    <>
      <header className="pageHeader">
        <h1>Create Quiz</h1>
        <p>Add a title and one or more questions to build your quiz.</p>
      </header>
      <div className="pageContent">
        <CreateQuizForm />
      </div>
    </>
  );
}
