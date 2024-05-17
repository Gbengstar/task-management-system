import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { TaskGatewayService } from '../service/gateway.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: false },
  transports: ['websocket'],
})
export class TaskGateway implements OnGatewayConnection {
  private readonly logger = new Logger(TaskGateway.name);

  @WebSocketServer() server: Socket;

  constructor(private readonly taskGatewayService: TaskGatewayService) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug({ args });
    this.taskGatewayService.handleConnection(client);
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}
