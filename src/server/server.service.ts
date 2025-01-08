import { Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { CreateServerDto } from 'lib/shared/dto/server/create-server.dto';
import { UpdateServerDto } from 'lib/shared/dto/server/update-server.dto';
import { ChannelType } from '@discord-clone/DiscordClone';

@Injectable()
export class ServerService {
  constructor(private prisma: PrismaService) {}
  async create(createServerDto: CreateServerDto, ownerId: string) {
    return await this.prisma.server.create({
      data: {
        ownerId,
        name: createServerDto.name,
        channels: {
          create: [
            {
              name: 'general',
              type: ChannelType.CHAT,
            },
            {
              name: 'general',
              type: ChannelType.VOICE,
            },
          ],
        },
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
