import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { SendFriendRequestDto } from 'lib/shared/dto/friend/friend-request.dto';
import { UserPresenceActive } from 'lib/shared/type/socket.type';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class SocketService {
  private server: Server;
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
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
    console.log('user connected', {
      id: userDecoded.userId,
      username: userDecoded.username,
      role: userDecoded.role,
    });
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

    await this.cacheManager.set(`user ${user.userId}`, activeUser);
  }

  async emitPresenceToFriends(activeUser: UserPresenceActive) {
    const friends = await this.userService.getFriends(activeUser.userId);
    for (const friend of friends) {
      const user = await this.cacheManager.get(`user ${friend.id}`);
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

  async sendFriendRequest(
    sendFriendRequestDto: SendFriendRequestDto,
    userId: string,
  ) {
    const { friendId } = sendFriendRequestDto;
    // Gửi yêu cầu kết bạn đến bạn của người dùng
    const user = await this.cacheManager.get(`user ${friendId}`);
    const f = user as UserPresenceActive;
    this.server.to(f.socketId).emit('friend_request', { userId, friendId });
  }

  async acceptFriendRequestNotification(userId: string, friendId: string) {
    // Tìm yêu cầu kết bạn giữa userId và friendId
    const request = await this.prisma.friend.findFirst({
      where: {
        userId: userId,
        friendId: friendId,
        status: 'PENDING', // Đảm bảo rằng chỉ có yêu cầu đang chờ được chấp nhận
      },
    });

    // Nếu không tìm thấy yêu cầu kết bạn, trả về lỗi hoặc thông báo không hợp lệ
    if (!request) {
      throw new Error('Friend request not found or already processed.');
    }

    // Cập nhật trạng thái yêu cầu kết bạn thành "ACCEPTED"
    const updatedRequest = await this.prisma.friend.update({
      where: {
        id: request.id, // Cập nhật theo ID của yêu cầu kết bạn
      },
      data: {
        status: 'ACCEPTED',
      },
    });

    // Gửi thông báo chấp nhận kết bạn tới cả hai người dùng qua socket
    this.server.to(userId).emit('friend_accepted', { friendId });
    this.server.to(friendId).emit('friend_accepted', { userId });

    return updatedRequest;
  }

  async rejectFriendRequestNotification(userId: string, friendId: string) {
    const request = await this.prisma.friend.delete({
      where: { userId_friendId: { userId, friendId } },
    });

    this.server.to(friendId).emit('friend_rejected', { userId });
    return request;
  }
}
