import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { IdentityService } from './services/user-identity.service';
import { PrismaModule } from 'lib/data-access/prisma/prisma.module';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [PrismaModule, forwardRef(() => SocketModule)],
  controllers: [UserController],
  providers: [UserService, IdentityService, PrismaService],
  exports: [UserService, IdentityService],
})
export class UserModule {}
