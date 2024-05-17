import { Module } from '@nestjs/common';
import { TaskService } from './service/task.service';
import { TaskController } from './controller/task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './model/task.model';
import { JWTService } from '../../libs/authentication/src';
import { TaskGatewayService } from './service/gateway.service';
import { TaskGateway } from './gateway/task.gateway';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskGatewayService, TaskGateway, JWTService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Task.name, useFactory: () => TaskSchema },
    ]),
  ],
})
export class TaskModule {}
