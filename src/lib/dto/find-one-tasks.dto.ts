import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../interfaces/task-status.enum';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindOneTasksDto {
  @ApiPropertyOptional({
    type: [TaskStatus],
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsEnum(TaskStatus, { each: true })
  status: TaskStatus;
}
