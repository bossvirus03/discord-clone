import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { SocketAuthMiddleware } from '../../lib/shared/middleware/auth-socket.middleware';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './guards/jwt-ws.guard';
import { ServerToClientEvents } from '../../lib/shared/type/ws-event';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsJwtGuard)
export class SocketGateway {
  constructor(
    private readonly socketService: SocketService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    // private readonly userService: UserService,
  ) {}

  @WebSocketServer() server: Server<any, ServerToClientEvents>;
  afterInit(client: Socket) {
    this.socketService.initializeServer(this.server);
    client.use(
      SocketAuthMiddleware(this.jwtService, this.configService) as any,
    );
  }
  // Khi một client kết nối, gọi initializeServer để đảm bảo server được thiết lập
  async handleConnection(socket: Socket): Promise<void> {
    this.socketService.handleConnection(socket);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    this.socketService.handleDisconnect(socket);
  }

  @SubscribeMessage('setUserId')
  handleUserId(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.data.userId = data.userId;
    console.log(`User connected with ID: ${data.userId}`);
  }

  // @SubscribeMessage('sendFriendRequest')
  // async handleSendFriendRequest(
  //   @MessageBody() data: { userId: string; friendId: string },
  //   @ConnectedSocket() socket: Socket,
  // ) {
  //   const { userId, friendId } = data;
  //   try {
  //     const friendRequest =
  //       await this.socketService.sendFriendRequestNotification(
  //         userId,
  //         friendId,
  //       );
  //     return friendRequest;
  //   } catch (error) {
  //     console.error('Error sending friend request:', error);
  //     socket.emit('error', { message: 'Không thể gửi yêu cầu kết bạn' });
  //   }
  // }

  // @SubscribeMessage('acceptFriendRequest')
  // async handleAcceptFriendRequest(
  //   @MessageBody() data: { userId: string; friendId: string },
  //   @ConnectedSocket() socket: Socket,
  // ) {
  //   const { userId, friendId } = data;
  //   try {
  //     const updatedRequest =
  //       await this.socketService.acceptFriendRequestNotification(
  //         userId,
  //         friendId,
  //       );
  //     socket.emit('friend_accepted', {
  //       message: 'Friend request accepted',
  //       data: updatedRequest,
  //     });
  //   } catch (error) {
  //     console.error('Error accepting friend request:', error);
  //     socket.emit('error', { message: 'Không thể xác nhận yêu cầu kết bạn' });
  //   }
  // }

  // @SubscribeMessage('rejectFriendRequest')
  // async handleRejectFriendRequest(
  //   @MessageBody() data: { userId: string; friendId: string },
  //   @ConnectedSocket() socket: Socket,
  // ) {
  //   const { userId, friendId } = data;
  //   try {
  //     const rejectedRequest =
  //       await this.socketService.rejectFriendRequestNotification(
  //         userId,
  //         friendId,
  //       );
  //     socket.emit('friend_rejected', {
  //       message: 'Friend request rejected',
  //       data: rejectedRequest,
  //     });
  //   } catch (error) {
  //     console.error('Error rejecting friend request:', error);
  //     socket.emit('error', { message: 'Không thể từ chối yêu cầu kết bạn' });
  //   }
  // }
}
