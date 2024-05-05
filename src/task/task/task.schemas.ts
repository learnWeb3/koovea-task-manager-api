import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Customer } from '../../customer/customer/customer.schemas';
import { TaskStatus } from '../../lib/interfaces/task-status.enum';
import { v4 as uuid } from 'uuid';

export type TaskHistoryItemDocument = HydratedDocument<TaskHistoryItem>;

@Schema({
  timestamps: true,
  _id: false,
})
export class TaskHistoryItem {
  @Prop({
    type: mongoose.Schema.Types.String,
    ref: Customer.name,
  })
  customer: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  label: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Prop({
    type: mongoose.Schema.Types.Array,
    ref: Customer.name,
  })
  enlisted: string[];
}

const TaskHistoryItemSchema = SchemaFactory.createForClass(TaskHistoryItem);

// TASK
export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
})
export class Task {
  @Prop({
    type: mongoose.Schema.Types.String,
    default: function genUUID() {
      return uuid();
    },
  })
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  label: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Prop({
    type: mongoose.Schema.Types.String,
    ref: Customer.name,
  })
  creator: string;

  @Prop({
    type: mongoose.Schema.Types.Array,
    ref: Customer.name,
  })
  enlisted: string[];

  @Prop({
    type: [TaskHistoryItemSchema],
  })
  history: TaskHistoryItem[];
}

const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({
  label: 1,
});

TaskSchema.index({
  description: 1,
});

TaskSchema.index({
  status: 1,
});

TaskSchema.index({
  creator: 1,
});

export { TaskSchema };
