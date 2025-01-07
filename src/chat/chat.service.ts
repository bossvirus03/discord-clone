import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import {
  CreateDirectMessageDto,
  CreateServerMessageDto,
} from 'lib/shared/dto/message/create-message.dto';
import { ServerToClientEvents } from 'lib/shared/type/ws-event';
import { Server } from 'socket.io';

@Injectable()
export class ChatService {
  private server: Server<any, ServerToClientEvents>;

  initializeServer(server: Server) {
    this.server = server;
  }
  sendDirectMessage(createMessageDto: CreateDirectMessageDto) {
    this.server.emit('direct_message', createMessageDto);
  }
  sendServerMessage(createMessageDto: CreateServerMessageDto) {
    this.server.emit('server_message', createMessageDto);
  }
}
