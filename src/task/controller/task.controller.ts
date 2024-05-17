import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from '../service/task.service';
import { Task } from '../model/task.model';
import {
  ArrayValidationPipe,
  ObjectValidationPipe,
  StringValidationPipe,
} from '../../../libs/pipes/src';
import {
  createTaskValidator,
  getTaskValidator,
  updateTaskValidator,
} from '../validator/task.validator';
import {
  arrayValidator,
  objectIdValidator,
} from '../../../libs/utils/src/validator/custom.validator';
import { TokenDecorator } from '../../../libs/authentication/src/decorator/authentication.decorator';
import { TokenDataDto } from '../../../libs/authentication/src/dto/authentication.dto';
import { TaskGatewayService } from '../service/gateway.service';
import { TaskStreamEventEnum } from '../enum/task.enum';
import { GetTaskDto } from '../dto/task.dto';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly gatewayService: TaskGatewayService,
  ) {}

  @Post()
  async createTask(
    @Body(new ObjectValidationPipe(createTaskValidator)) task: Task,
    @TokenDecorator() { id: user }: TokenDataDto,
  ) {
    // add the user id to the request body
    task.user = user;

    // create task data and persist in database
    const createdTask = await this.taskService.create(task);

    // stream created task data to client through websocket event
    this.gatewayService.streamTask(
      task.user,
      TaskStreamEventEnum.CREATE_TASK,
      createdTask.toJSON(),
    );

    return createdTask;
  }

  @Get()
  getTasks(
    @TokenDecorator() { id: user }: TokenDataDto,
    @Query(new ObjectValidationPipe(getTaskValidator))
    { page, limit, ...query }: GetTaskDto,
  ) {
    return this.taskService.findAndPaginateResponse<Task>(
      { page, limit },
      { user, ...query },
      { createdAt: -1 },
    );
  }

  @Patch('/:id')
  async updateTask(
    @Body(new ObjectValidationPipe(updateTaskValidator)) task: Task,
    @Param('id', new StringValidationPipe(objectIdValidator)) id: string,
    @TokenDecorator() { id: user }: TokenDataDto,
  ) {
    const updatedTask = await this.taskService.findOneAndUpdateOrErrorOut(
      { _id: id, user },
      task,
    );
    return updatedTask;
  }

  @Delete()
  deleteTasks(
    @TokenDecorator() { id: user }: TokenDataDto,
    @Query('ids', new ArrayValidationPipe(arrayValidator)) ids: string[],
  ) {
    return this.taskService.deleteMany({ user, _id: { $in: ids } });
  }
}
