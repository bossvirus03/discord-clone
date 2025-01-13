import { IsEmail } from 'class-validator';
import { UpdateUserDto } from './../../../lib/shared/dto/user/update-user.dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '../../../lib/shared/dto/user/create-user.dto';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { Channel, ChannelType } from '@discord-clone/DiscordClone';
import { Roles } from 'lib/shared/decorators/roles.decorator';
import { UserRole } from '@discord-clone/DiscordClone';
import { UpdateStatusUserDto } from 'lib/shared/dto/user/update-status-user.dto';
import { createHashPassword } from 'lib/helper';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const pass = await createHashPassword(createUserDto.password)
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          identity: {
            create: {
              username: createUserDto.username,
              email: createUserDto.email,
              password: pass, // Giả sử bạn xử lý mật khẩu ở đâu đó trước
            },
          },
        },
      });

      // Sau khi user được tạo thành công, bạn có thể tạo kênh cho user đó
      const channel: Channel = await this.prisma.channel.create({
        data: {
          name: `Personal Channel for ${createUserDto.name}`, // Tên kênh có thể thay đổi tùy ý
          type: ChannelType.PERSONAL, // Loại kênh
          ownerId: user.id, // Gán user.id làm ownerId cho kênh
        },
      });

      // Cập nhật user với personalChannelId
      const result = await this.prisma.user.update({
        where: { id: user.id },
        data: { personalChannelId: channel.id },
      });

      return result;
    } catch (error) {
      //todo
      if (error.errorCode === 'P2025') {
        throw new BadRequestException('User not found');
      }
    }

  }

  @Roles(UserRole.ADMIN)
  findAll() {
    return this.prisma.user.findMany();
  }

  @Roles(UserRole.ADMIN)
  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: { friends: true }
      });
      return user;
    } catch (error) {
      //todo
      if (error.errorCode === 'P2025') {
        throw new BadRequestException('User not found');
      }
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: dto
      });
      return user;
    } catch (error) {
      //todo
      if (error.errorCode === 'P2025') {
        throw new BadRequestException('User not found');
      }
    }
  }

  async updateStatus(id: string, dto: UpdateStatusUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: dto
      });
      return user;
    } catch (error) {
      //todo
      if (error.errorCode === 'P2025') {
        throw new BadRequestException('User not found');
      }
    }
  }

  @Roles(UserRole.ADMIN)
  async remove(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });
      //todo
    } catch (error) {
      if (error.errorCode === 'P2025') {
        throw new BadRequestException('User not found');
      }
    }
  }
}
