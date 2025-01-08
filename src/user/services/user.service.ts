import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../lib/shared/dto/user/create-user.dto';
import { UpdateUserDto } from '../../../lib/shared/dto/user/update-user.dto';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { Channel, ChannelType } from '@discord-clone/DiscordClone';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        identity: {
          create: {
            username: createUserDto.username,
            email: createUserDto.email,
            password: createUserDto.password, // Giả sử bạn xử lý mật khẩu ở đâu đó trước
          },
        },
      },
    });

    // Sau khi user được tạo thành công, bạn có thể tạo kênh cho user đó
    const channel: Channel = await this.prisma.channel.create({
      data: {
        name: `Personal Channel for ${createUserDto.name}`, // Tên kênh có thể thay đổi tùy ý
        type: 'PERSONAL', // Loại kênh
        ownerId: user.id, // Gán user.id làm ownerId cho kênh
      },
    });

    // Cập nhật user với personalChannelId
    const result = await this.prisma.user.update({
      where: { id: user.id },
      data: { personalChannelId: channel.id },
    });

    return result;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
      return user;
    } catch (error) {
      // if(error instanceof Error)
      if (error.errorCode === 'P2025') {
        throw new BadRequestException('User not found');
      }
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
