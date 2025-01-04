import { PrismaClient } from '@discord-clone/DiscordClone';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  [x: string]: any;
  async onModuleInit() {
    await this.$connect();
  }
}
