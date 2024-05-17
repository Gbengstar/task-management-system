import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../model/task.model';
import { Model } from 'mongoose';
import { BaseService } from '../../../libs/utils/src';

@Injectable()
export class TaskService extends BaseService<Task> {
  constructor(@InjectModel(Task.name) private readonly TaskModel: Model<Task>) {
    super(TaskModel);
  }
}
