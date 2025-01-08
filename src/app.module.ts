import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ServerModule } from './server/server.module';
import { ChatModule } from './chat/chat.module';
import { PresenceModule } from './presence/presence.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { RelasonshipModule } from './relasonship/relasonship.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    ServerModule,
    SocketModule,
    ChatModule,
    PresenceModule,
    ChannelModule,
    RelasonshipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
