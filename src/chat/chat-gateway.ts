import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Điều này cho phép mọi nguồn, có thể cấu hình lại nếu cần
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: { [socketId: string]: string } = {};

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    delete this.users[client.id];
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('message')
  handleMessage(
    client: Socket,
    payload: { message: string; username: string },
  ) {
    this.server.emit('message', {
      message: payload.message,
      username: payload.username,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('setUsername')
  handleSetUsername(client: Socket, username: string) {
    this.users[client.id] = username;
    this.server.emit('users', this.users);
  }
}
