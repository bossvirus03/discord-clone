import { Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { CreateServerDto } from 'lib/shared/dto/server/create-server.dto';
import { UpdateServerDto } from 'lib/shared/dto/server/update-server.dto';
import { ChannelType } from '@discord-clone/DiscordClone';

@Injectable()
export class ServerPermissionService {
  constructor(private prisma: PrismaService) { }

}
