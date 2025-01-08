import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { SendFriendRequestDto } from 'lib/shared/dto/friend/friend-request.dto';
import { UserPresenceActive } from 'lib/shared/type/socket.type';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RelasonshipService } from 'src/relasonship/relasonship.service';

@Injectable()
export class SocketService {
  private server: Server;
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => RelasonshipService))
    private relasonshipService: RelasonshipService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  initializeServer(server: Server) {
    this.server = server;
  }

  // Lưu socket ID khi người dùng kết nối
  async handleConnection(socket: Socket) {
    console.log('Client connected: ' + socket.id);

    const jwt = socket.handshake.headers.authorization ?? null;
    if (!jwt) {
      this.handleDisconnect(socket);
      return;
    }
    const token = jwt?.split(' ')[1];

    const userDecoded = await this.authService.decodeToken(token);
    if (!userDecoded) {
      this.handleDisconnect(socket);
      return;
    }

    socket.data.user = userDecoded;
    this.setActiveStatus(socket, true);
  }

  handleDisconnect(socket: Socket): void {
    console.log('Client disconnected: ' + socket.id);
    this.setActiveStatus(socket, false);
  }

  async setActiveStatus(socket: Socket, isActive) {
    const user = socket.data?.user;
    if (!user) {
      return;
    }
    const activeUser: UserPresenceActive = {
      userId: socket.data.user.userId,
      socketId: socket.id,
      isActive: isActive,
    };

    await this.emitPresenceToFriends(activeUser);

    await this.cacheManager.set(`user_${user.userId}`, activeUser, 0);
    const u = await this.cacheManager.get(`user_${user.userId}`);

    const _u = u as UserPresenceActive;
    console.log('user connected', {
      id: _u.userId,
      socket: _u.socketId,
    });
  }

  async emitPresenceToFriends(activeUser: UserPresenceActive) {
    const friends = await this.relasonshipService.getFriends(activeUser.userId);
    for (const friend of friends) {
      const user = await this.cacheManager.get(`user_${friend.id}`);
      if (!user) {
        return;
      }
      const f = user as UserPresenceActive;
      this.server.to(f.socketId).emit('friend_presence_active', {
        userId: activeUser.userId,
        isActive: activeUser.isActive,
      });
    }
  }

  async sendFriendRequest(friendId: string, userId: string) {
    // Gửi yêu cầu kết bạn đến bạn của người dùng
    const user = await this.cacheManager.get(`user_${friendId}`);
    const user1 = await this.cacheManager.get(`user_${userId}`);
    console.log(user, user1);
    const f = user as UserPresenceActive;
    try {
      this.server.to(f.socketId).emit('friend_request', { userId, friendId });
    } catch (error) {
      console.error(error);
    }
  }

  async acceptFriendRequest(userId: string, friendId: string) {
    try {
      const userSendRequest = await this.cacheManager.get(`user_${userId}`);
      const userReceiveRequest = await this.cacheManager.get(
        `user_${friendId}`,
      );
      console.log(userSendRequest, userReceiveRequest);
      const us = userSendRequest as UserPresenceActive;
      const ur = userReceiveRequest as UserPresenceActive;
      // Gửi thông báo chấp nhận kết bạn tới cả hai người dùng qua socket
      this.server.to(us.socketId).emit('friend_accepted', { friendId });
      this.server.to(ur.socketId).emit('friend_accepted', { userId });
    } catch (error) {
      console.error(error);
    }
  }

  async rejectFriendRequest(userId: string, friendId: string) {
    try {
      const userReceiveRequest = await this.cacheManager.get(
        `user_${friendId}`,
      );
      const ur = userReceiveRequest as UserPresenceActive;
      this.server.to(ur.socketId).emit('friend_rejected', { friendId: userId });
    } catch (error) {
      console.error(error);
    }
  }
}
