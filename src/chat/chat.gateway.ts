import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/socket/guards/jwt-ws.guard';
import { ServerToClientEvents } from 'lib/shared/type/ws-event';
import { Server, Socket } from 'socket.io';
import { SocketAuthMiddleware } from 'lib/shared/middleware/auth-socket.middleware';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsJwtGuard)
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer() server: Server<any, ServerToClientEvents>;

  afterInit(client: Socket) {
    this.chatService.initializeServer(this.server);

    client.use(
      SocketAuthMiddleware(this.jwtService, this.configService) as any,
    );
  }
}
