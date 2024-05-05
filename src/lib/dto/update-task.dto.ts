import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../interfaces/task-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enlisted: string[];
  @ApiPropertyOptional({
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
