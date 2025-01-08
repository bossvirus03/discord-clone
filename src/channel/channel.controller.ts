import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateMessageDto } from 'lib/shared/dto/message/create-message.dto';
import { User } from 'lib/shared/decorators/customize.decorator';
import { JwtPayload } from 'lib/shared/type/jwt-payload.type';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('messages')
  findMessages(@User() user: JwtPayload) {
    const userId = user.userId;
    return this.channelService.findMessages(userId);
  }

  @Post(':channelId/send-message')
  sendMessageDirect(
    @Param('channelId') channelId: string,
    @User() user: JwtPayload,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const userId = user.userId;
    return this.channelService.sendMessageDirect(
      userId,
      channelId,
      createMessageDto,
    );
  }
}
