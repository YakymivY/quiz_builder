import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  create(_createQuizDto: CreateQuizDto) {
    throw new NotImplementedException('Quiz creation is not implemented yet');
  }

  findAll() {
    throw new NotImplementedException('Quiz listing is not implemented yet');
  }

  findOne(_id: string) {
    throw new NotImplementedException('Quiz detail is not implemented yet');
  }

  remove(_id: string) {
    throw new NotImplementedException('Quiz deletion is not implemented yet');
  }
}
