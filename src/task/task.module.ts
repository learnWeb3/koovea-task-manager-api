import { Module, forwardRef } from '@nestjs/common';
import { TaskService } from './task/task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task/task.schemas';
import { CustomerModule } from '../customer/customer.module';

@Module({
  providers: [TaskService],
  exports: [TaskService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
    forwardRef(() => CustomerModule),
  ],
})
export class TaskModule {}
