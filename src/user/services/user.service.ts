import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../lib/shared/dto/user/create-user.dto';
import { UpdateUserDto } from '../../../lib/shared/dto/user/update-user.dto';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { SendFriendRequestDto } from 'lib/shared/dto/friend/friend-request.dto';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private socketService: SocketService,
  ) {}

  create(createUserDto: CreateUserDto) {
    const { name } = createUserDto;
    return this.prisma.user.create({
      data: {
        name,
        identity: {
          create: {
            username: createUserDto.username,
            email: createUserDto.email,
            password: createUserDto.password,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async sendFriendRequest(
    sendFriendRequestDto: SendFriendRequestDto,
    userId: string,
  ) {
    if (!userId || !sendFriendRequestDto.friendId) {
      throw new Error('User ID and Friend ID must be provided');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const friend = await this.prisma.user.findUnique({
      where: { id: sendFriendRequestDto.friendId },
    });

    if (!user || !friend) {
      throw new Error('User or Friend not found');
    }

    const existingRequest = await this.prisma.friend.findFirst({
      where: {
        OR: [
          {
            userId: userId,
            friendId: sendFriendRequestDto.friendId,
          },
          {
            userId: sendFriendRequestDto.friendId,
            friendId: userId,
          },
        ],
      },
    });

    if (existingRequest) {
      throw new Error('Friend request already exists');
    }

    await this.prisma.friend.create({
      data: {
        status: 'PENDING',
        user: {
          connect: { id: userId },
        },
        friend: {
          connect: { id: sendFriendRequestDto.friendId },
        },
      },
    });

    this.socketService.sendFriendRequest(sendFriendRequestDto, userId);
    return 'Friend request sent successfully!';
  }

  async acceptFriendRequest(
    sendFriendRequestDto: SendFriendRequestDto,
    userId: string,
  ) {
    return await this.prisma.friend.update({
      where: {
        userId_friendId: {
          userId: userId,
          friendId: sendFriendRequestDto.friendId,
        },
      },
      data: {
        status: 'ACCEPTED',
      },
    });
  }

  async rejectFriendRequest(
    sendFriendRequestDto: SendFriendRequestDto,
    userId: string,
  ) {
    return await this.prisma.friend.update({
      where: {
        userId_friendId: {
          userId: userId,
          friendId: sendFriendRequestDto.friendId,
        },
      },
      data: {
        status: 'REJECTED',
      },
    });
  }

  async removeFriend(
    sendFriendRequestDto: SendFriendRequestDto,
    userId: string,
  ) {
    return await this.prisma.friend.delete({
      where: {
        userId_friendId: {
          userId: userId,
          friendId: sendFriendRequestDto.friendId,
        },
      },
    });
  }

  async getFriends(userId: string) {
    const friends = await this.prisma.friend.findMany({
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
