import { Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { CreateDirectMessageDto } from 'lib/shared/dto/message/create-message.dto';
import { UpdateMessageDto } from 'lib/shared/dto/message/update-message.dto';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
    private chatGateway: ChatGateway,
  ) {}
  async create(createMessageDto: CreateDirectMessageDto) {
    const createdMessage = await this.prisma.directMessage.create({
      data: {
        content: createMessageDto.content,
        senderId: createMessageDto.senderId,
        receiverId: createMessageDto.receiverId,
      },
    });

    this.chatService.sendDirectMessage(createdMessage);
    return createdMessage;
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
