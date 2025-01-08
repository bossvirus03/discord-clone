import { Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { CreateMessageDto } from 'lib/shared/dto/message/create-message.dto';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
  ) {}
  async findMessages(userId: string) {
    return await this.prisma.channel.findUnique({
      where: {
        id: userId,
      },
      include: {
        messages: true,
      },
    });
  }

  async sendMessageDirect(
    senderId: string,
    channelId: string,
    createMessageDto: CreateMessageDto,
  ) {
    const { content } = createMessageDto;
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });
    if (!channel) {
      throw new Error('channel not found');
    }

    await this.chatService.sendMessage(senderId, channel, content);
    return await this.prisma.message.create({
      data: {
        content,
        senderId,
        channelId: channelId,
      },
    });
  }
}
