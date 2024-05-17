import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { TaskGatewayService } from '../service/gateway.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: false },
  transports: ['websocket'],
})
export class TaskGateway implements OnGatewayConnection {
  constructor(private readonly taskGatewayService: TaskGatewayService) {}

  // receive socket created by current user
  handleConnection(client: Socket) {
    this.taskGatewayService.handleConnection(client);
  }
}
