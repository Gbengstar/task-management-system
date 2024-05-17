import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Request } from 'express';
import { JWTService } from '../../../libs/authentication/src';
import { TokenDataDto } from '../../../libs/authentication/src/dto/authentication.dto';
import { getToken } from '../../../libs/authentication/src/function/authentication.function';
import { Task } from '../model/task.model';

@Injectable()
export class TaskGatewayService {
  private readonly logger = new Logger(TaskGatewayService.name);

  private readonly connectedClients: Map<string, Socket> = new Map();

  constructor(private readonly jwtService: JWTService) {}

  async handleConnection(socket: Socket): Promise<void> {
    let clientToken: TokenDataDto;

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientToken?.id);
      this.logger.debug(`socket with id: ${socket.id} disconnected`);
    });

    // get token in the socket header
    try {
      clientToken = await this.jwtService.verifyToken(
        getToken(socket.request as Request),
      );
    } catch (error) {
      this.logger.error(error);
      socket.client._disconnect();
      return;
    }
    // save a reference to the new socket received
    this.connectedClients.set(clientToken.id, socket);
  }

  streamTask(user: string, event: string, data: Task) {
    try {
      // get a reference to the user socket stored in Map
      const socket = this.connectedClients.get(user);
      if (socket) socket.emit(event, data);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
