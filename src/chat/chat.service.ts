import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserPresenceActive } from 'lib/shared/type/socket.type';
import { ServerToClientEvents } from 'lib/shared/type/ws-event';
import { Server } from 'socket.io';
import { Channel } from '@discord-clone/DiscordClone';

@Injectable()
export class ChatService {
  private server: Server<any, ServerToClientEvents>;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  initializeServer(server: Server) {
    this.server = server;
  }
  async sendMessage(senderId: string, channel: Channel, content: string) {
    const receiver = await this.cacheManager.get(`user_${channel.ownerId}`);
    const r = receiver as UserPresenceActive;
    console.log('check >>> ', r);
    this.server.to(r.socketId).emit('message', {
      content,
      receiverId: channel.ownerId,
      senderId,
    });
  }
}
