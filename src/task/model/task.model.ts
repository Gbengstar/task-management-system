import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskPriorityEnum } from '../enum/task.enum';
import { Auth } from '../../auth/model/auth.model';

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: SchemaTypes.ObjectId, ref: Auth.name })
  user: string;

  @Prop({ type: SchemaTypes.String })
  task: string;

  @Prop({ type: SchemaTypes.Number, default: TaskPriorityEnum.MEDIUM })
  priority: TaskPriorityEnum;

  @Prop({ type: SchemaTypes.Boolean })
  isDone: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
