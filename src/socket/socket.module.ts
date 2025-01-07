import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { PrismaModule } from 'lib/data-access/prisma/prisma.module';
import { SocketService } from './socket.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    AuthModule,
    UserModule,
    CacheModule.register(),
  ],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
