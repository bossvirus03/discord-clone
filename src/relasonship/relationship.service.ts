import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class RelationshipService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => SocketService))
    private socketService: SocketService,
  ) { }
  async sendFriendRequest(friendId: string, userId: string) {
    if (!userId || !friendId) {
      throw new Error('User ID and Friend ID must be provided');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const friend = await this.prisma.user.findUnique({
      where: { id: friendId },
    });

    if (!user || !friend) {
      throw new Error('User or Friend not found');
    }

    const existingRequest = await this.prisma.relationship.findFirst({
      where: {
        OR: [
          {
            userId: userId,
            friendId: friendId,
          },
          {
            userId: friendId,
            friendId: userId,
          },
        ],
      },
    });

    if (existingRequest) {
      throw new Error('Friend request already exists');
    }

    await this.prisma.relationship.create({
      data: {
        status: 'PENDING',
        user: {
          connect: { id: userId },
        },
        friend: {
          connect: { id: friendId },
        },
      },
    });

    this.socketService.sendFriendRequest(friendId, userId);
    return 'Friend request sent successfully!';
  }

  async acceptFriendRequest(friendId: string, userId: string) {
    const existingFriend = await this.prisma.relationship.findFirst({
      where: {
        AND: [
          {
            userId,
            friendId,
          },
        ],
      },
    });

    if (!existingFriend) {
      throw new Error('Friend request not found');
    }

    await this.prisma.relationship.update({
      where: {
        userId_friendId: {
          userId,
          friendId,
        },
      },
      data: {
        status: 'ACCEPTED',
      },
    });

    await this.socketService.acceptFriendRequest(userId, friendId);
    return 'Friend request accepted!';
  }

  async rejectFriendRequest(friendId: string, userId: string) {
    console.log(userId, friendId);
    const existingFriend = await this.prisma.relationship.findFirst({
      where: {
        AND: [
          {
            userId: userId,
            friendId: friendId,
          },
        ],
      },
    });

    if (!existingFriend) {
      throw new Error('Friend request not found');
    }
    await this.prisma.relationship.update({
      where: {
        userId_friendId: {
          userId: userId,
          friendId: friendId,
        },
      },
      data: {
        status: 'REJECTED',
      },
    });

    this.socketService.rejectFriendRequest(userId, friendId);
    return 'Friend request rejected!';
  }

  async removeFriend(friendId: string, userId: string) {
    return await this.prisma.relationship.delete({
      where: {
        userId_friendId: {
          userId,
          friendId,
        },
      },
    });
  }

  async getFriends(userId: string) {
    const friends = await this.prisma.relationship.findMany({
      where: {
        OR: [
          { userId, status: 'ACCEPTED' }, // Quan hệ bạn bè mà userId là người gửi
          { friendId: userId, status: 'ACCEPTED' }, // Quan hệ bạn bè mà userId là người nhận
        ],
      },
      include: {
        user: true, // Lấy thông tin của người dùng là bạn bè
        friend: true, // Lấy thông tin của bạn bè
      },
    });

    // Xử lý kết quả để chỉ trả về danh sách người bạn (không bao gồm chính userId)
    const friendList = friends.map((relation) => {
      if (relation.userId === userId) {
        return relation.friend; // Nếu userId là người gửi, trả về thông tin bạn bè
      } else {
        return relation.user; // Nếu userId là người nhận, trả về thông tin bạn bè
      }
    });

    return friendList;
  }
}
