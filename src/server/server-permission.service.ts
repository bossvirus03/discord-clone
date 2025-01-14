import { Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { CreateServerDto } from 'lib/shared/dto/server/create-server.dto';
import { UpdateServerDto } from 'lib/shared/dto/server/update-server.dto';
import { ChannelType } from '@discord-clone/DiscordClone';
import { CreateServerPermissionDto } from 'lib/shared/dto/server/server-permission/create-server-permission.dto';

@Injectable()
export class ServerPermissionService {
  constructor(private prisma: PrismaService) { }
  async create(dto: CreateServerPermissionDto) {
    return await this.prisma.serverPermission.create({
      data: {
        name: dto.name,
        url: dto.url,
        userId: dto.userId,
        serverId: dto.serverId
      },
    });
  }

  findAll() {
    return `This action returns all server`;
  }

  findOne(id: number) {
    return `This action returns a #${id} server`;
  }

  update(id: number, updateServerDto: UpdateServerDto) {
    return `This action updates a #${id} server`;
  }

  remove(id: number) {
    return `This action removes a #${id} server`;
  }
}
