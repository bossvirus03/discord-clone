import { ErrorMessage } from './../../lib/shared/enum/error.enum';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { CreateServerDto } from 'lib/shared/dto/server/create-server.dto';
import { UpdateServerDto } from 'lib/shared/dto/server/update-server.dto';
import { ChannelType, UserRole } from '@discord-clone/DiscordClone';
import { Roles } from 'lib/shared/decorators/roles.decorator';
import { ServerMessage } from 'lib/shared/responses/server/server-response.message';
import { CustomError } from 'lib/shared/error/custom.error';

@Injectable()
export class ServerService {
  constructor(private prisma: PrismaService,
  ) { }
  async create(dto: CreateServerDto, ownerId: string) {
    try {
      return await this.prisma.server.create({
        data: {
          ownerId,
          name: dto.name,
          iconUrl: dto.iconUrl,
          badges: dto.badges
        },
      });
    } catch (error) {
      throw new CustomError(ErrorMessage.COMMON_BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

  }
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.prisma.server.findMany();
  }
  @Roles(UserRole.ADMIN)
  async findOne(id: string) {
    try {
      const server = await this.prisma.server.findUniqueOrThrow({
        where: { id }
      });
      return server;
    } catch (error) {
      if (error.errorCode === 'P2025') {
        throw new CustomError(ErrorMessage.SERVER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    }
  }

  async update(id: string, dto: UpdateServerDto) {
    try {
      const server = await this.prisma.server.update({
        where: { id },
        data: dto
      });
      return server;
    } catch (error) {
      //todo
      if (error.errorCode === 'P2025') {
        throw new CustomError(ErrorMessage.SERVER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });
      return {
        message: ServerMessage.DELETE_SUCCESS
      }
    } catch (error) {
      throw new CustomError(ErrorMessage.SERVER_NOT_FOUND, HttpStatus.BAD_REQUEST)
    }
  }
}
