import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.quiz.create({
    data: {
      title: 'Sample Quiz',
      questions: {
        create: [
          {
            text: 'TypeScript is a superset of JavaScript.',
            type: QuestionType.BOOLEAN,
            order: 0,
          },
          {
            text: 'Name one JavaScript framework.',
            type: QuestionType.INPUT,
            order: 1,
          },
          {
            text: 'Which are frontend frameworks?',
            type: QuestionType.CHECKBOX,
            order: 2,
            options: {
              create: [
                { label: 'React', order: 0 },
                { label: 'Express', order: 1 },
                { label: 'Vue', order: 2 },
                { label: 'NestJS', order: 3 },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
