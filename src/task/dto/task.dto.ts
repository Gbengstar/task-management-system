import { PaginationDto } from '../../../libs/utils/src/dto/utils.dto';
import { Task } from '../model/task.model';

export type GetTaskDto = PaginationDto & Pick<Task, 'isDone' | 'priority'>;
