import * as Joi from 'joi';
import { Task } from '../model/task.model';
import { TaskPriorityEnum } from '../enum/task.enum';
import { paginatorValidator } from '../../../libs/utils/src/paginator/paginator.validator';

export const createTaskValidator = Joi.object<Task>({
  task: Joi.string().required(),
  priority: Joi.number()
    .valid(...Object.values(TaskPriorityEnum))
    .default(TaskPriorityEnum.MEDIUM),
  isDone: Joi.boolean().valid(false).default(false),
});

export const updateTaskValidator = Joi.object<Task>({
  task: Joi.string(),
  priority: Joi.number().valid(...Object.values(TaskPriorityEnum)),
  isDone: Joi.boolean(),
});

export const getTaskValidator = paginatorValidator.append<Task>({
  priority: Joi.number().valid(...Object.values(TaskPriorityEnum)),
  isDone: Joi.boolean(),
});
