import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, QuestionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuestionTypeDto } from './dto/question-type.enum';
import { mapQuizDetail } from './quizzes.mapper';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    this.validateQuestions(createQuizDto);

    const quiz = await this.prisma.quiz.create({
      data: {
        title: createQuizDto.title.trim(),
        questions: {
          create: createQuizDto.questions.map((question) => ({
            text: question.text.trim(),
            type: question.type as QuestionType,
            order: question.order,
            ...(question.type === QuestionTypeDto.CHECKBOX
              ? {
                  options: {
                    create: question.options!.map((label, index) => ({
                      label: label.trim(),
                      order: index,
                    })),
                  },
                }
              : {}),
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: { orderBy: { order: 'asc' } },
          },
        },
      },
    });

    return mapQuizDetail(quiz);
  }

  async findAll() {
    const quizzes = await this.prisma.quiz.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionCount: quiz._count.questions,
    }));
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: { orderBy: { order: 'asc' } },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with id "${id}" not found`);
    }

    return mapQuizDetail(quiz);
  }

  async remove(id: string) {
    try {
      await this.prisma.quiz.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Quiz with id "${id}" not found`);
      }

      throw error;
    }
  }

  private validateQuestions({ questions }: CreateQuizDto) {
    for (const question of questions) {
      if (question.type === QuestionTypeDto.CHECKBOX) {
        const options = question.options ?? [];

        if (options.length < 2) {
          throw new BadRequestException(
            'CHECKBOX questions must include at least 2 options',
          );
        }

        if (options.some((option) => !option.trim())) {
          throw new BadRequestException(
            'CHECKBOX option labels must not be empty',
          );
        }

        continue;
      }

      if (question.options?.length) {
        throw new BadRequestException(
          `${question.type} questions must not include options`,
        );
      }
    }
  }
}
