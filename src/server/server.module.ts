import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { PrismaModule } from 'lib/data-access/prisma/prisma.module';
import { ServerPermissionService } from './server-permission.service';

@Module({
  imports: [PrismaModule],
  controllers: [ServerController],
  providers: [ServerService, ServerPermissionService],
})
export class ServerModule { }
