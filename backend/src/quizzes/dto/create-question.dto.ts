import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { QuestionTypeDto } from './question-type.enum';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsEnum(QuestionTypeDto)
  type: QuestionTypeDto;

  @IsInt()
  @Min(0)
  order: number;

  @ValidateIf((question) => question.type === QuestionTypeDto.CHECKBOX)
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  options?: string[];
}
