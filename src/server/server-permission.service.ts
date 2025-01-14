import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { UpdateServerDto } from 'lib/shared/dto/server/update-server.dto';
import { CreateServerPermissionDto } from 'lib/shared/dto/server/server-permission/create-server-permission.dto';
import { CustomError } from 'lib/shared/error/custom.error';
import { ErrorMessage } from 'lib/shared/enum/error.enum';
import { UpdateServerPermissionDto } from 'lib/shared/dto/server/server-permission/update-server-permission.dto';
import { ServerMessage } from 'lib/shared/responses/server/server-response.message';

@Injectable()
export class ServerPermissionService {
  constructor(private prisma: PrismaService) { }
  async create(dto: CreateServerPermissionDto, userId: string) {
    try {
      return await this.prisma.serverPermission.create({
        data: {
          name: dto.name,
          apiPath: dto.apiPath,
          description: dto.description,
          method: dto.method,
          userId: userId,
          serverId: dto.serverId
        },
      });
    } catch (error) {
      throw new CustomError(ErrorMessage.COMMON_BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

  }

  async findAllByServer(id: string) {
    const data = await this.prisma.serverPermission.findMany({
      where: { serverId: id }
    });
    return data;
  }

  async findOne(id: string) {
    try {
      const server = await this.prisma.serverPermission.findUniqueOrThrow({
        where: { id }
      });
      return server;
    } catch (error) {
      if (error.errorCode === 'P2025') {
        throw new CustomError(ErrorMessage.SERVER_PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    }
  }

  async update(id: string, dto: UpdateServerPermissionDto) {
    try {
      const data = await this.prisma.serverPermission.update({
        where: { id },
        data: dto
      });
      return data;
    } catch (error) {
      //todo
      if (error.errorCode === 'P2025') {
        throw new CustomError(ErrorMessage.SERVER_PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.serverPermission.delete({
        where: { id },
      });
      return {
        message: ServerMessage.DELETE_SUCCESS
      }
    } catch (error) {
      throw new CustomError(ErrorMessage.SERVER_PERMISSION_NOT_FOUND, HttpStatus.BAD_REQUEST)
    }
  }
}
