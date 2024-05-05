import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument, TaskHistoryItem } from './task.schemas';
import { FilterQuery, Model } from 'mongoose';
import {
  PaginatedResults,
  Pagination,
} from '../../lib/decorators/pagination.decorator';
import { SortFilters } from '../../lib/decorators/sort-filters.decorators';
import { CreateTaskDto } from '../../lib/dto/create-task.dto';
import { UpdateTaskDto } from '../../lib/dto/update-task.dto';
import { CustomerDocument } from '../../customer/customer/customer.schemas';
import { CustomerService } from '../../customer/customer/customer.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
  ) {}

  async createTask(
    creator: string,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskDocument> {
    const newTask = new this.taskModel({ ...createTaskDto, creator });
    return newTask.save();
  }

  async deleteTask(filters: FilterQuery<Task>) {
    const task = await this.taskModel.findOne(filters);
    if (!task) {
      throw new NotFoundException(`task not found`);
    }
    return task.deleteOne();
  }

  async deleteTasks(filters: FilterQuery<Task>): Promise<void> {
    await this.taskModel.deleteMany(filters);
  }

  async updateTask(
    filters: FilterQuery<Task>,
    updateTaskDto: UpdateTaskDto,
    customer: CustomerDocument,
  ): Promise<TaskDocument> {
    const initialTask = await this.taskModel.findOne(filters);
    const updatedTask = await this.taskModel.findOne(filters);
    if (!updatedTask) {
      throw new NotFoundException(`task not found`);
    }

    if (updateTaskDto.description) {
      updatedTask.description = updateTaskDto.description;
    }
    if (updateTaskDto.enlisted) {
      updatedTask.enlisted = updateTaskDto.enlisted;
    }
    if (updateTaskDto.status) {
      updatedTask.status = updateTaskDto.status;
    }

    if (initialTask.toJSON() !== updatedTask.toJSON()) {
      const newTaskHistoryItem = new TaskHistoryItem();
      newTaskHistoryItem.customer = customer._id;
      newTaskHistoryItem.description = initialTask.description;
      newTaskHistoryItem.enlisted = initialTask.enlisted;
      newTaskHistoryItem.label = initialTask.label;
      newTaskHistoryItem.status = initialTask.status;
      updatedTask.history = updatedTask?.history?.length
        ? [...updatedTask.history, newTaskHistoryItem]
        : [newTaskHistoryItem];
    }

    return await updatedTask.save();
  }

  async exists(filters: FilterQuery<Task>): Promise<boolean> {
    return await this.taskModel
      .exists(filters)
      .then(({ _id }) => (_id ? true : false));
  }

  async findOne(filters: FilterQuery<Task>): Promise<TaskDocument> {
    return this.taskModel.findOne(filters).populate(['creator', 'enlisted']);
  }

  async findAll(
    filters: FilterQuery<Task>,
    pagination: Pagination,
    sortFilters: SortFilters,
  ): Promise<PaginatedResults<TaskDocument>> {
    const results = await this.taskModel
      .aggregate([
        {
          $match: filters,
        },
        {
          $lookup: {
            from: this.customerService.getCollectionName(),
            localField: 'creator',
            foreignField: '_id',
            as: 'creators',
          },
        },
        {
          $lookup: {
            from: this.customerService.getCollectionName(),
            localField: 'enlisted',
            foreignField: '_id',
            as: 'enlisted',
          },
        },
        {
          $addFields: {
            creator: { $arrayElemAt: ['$creators', 0] },
          },
        },
        {
          $project: {
            creators: 0,
          },
        },
        {
          $sort: {
            [sortFilters.sort]: sortFilters.order,
          },
        } as any,
        {
          $skip: pagination.start,
        },
        {
          $limit: pagination.limit,
        },
      ])
      .exec();

    const count = await this.taskModel.aggregate([
      {
        $match: filters,
      },
      {
        $count: 'count',
      },
    ]);

    return {
      results,
      count: count[0]?.count || 0,
      start: pagination.start,
      limit: pagination.limit,
    };
  }
}
