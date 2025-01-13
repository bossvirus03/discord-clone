import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { SendFriendRequestDto } from 'lib/shared/dto/friend/friend-request.dto';
import { User } from 'lib/shared/decorators/customize.decorator';
import { JwtPayload } from 'lib/shared/type/jwt-payload.type';

@Controller('relationship')
export class RelationshipController {
  constructor(private readonly relasonshipService: RelationshipService) { }

  @Post(':friendId/send-friend-request')
  sendFriendRequest(
    @Param('friendId') friendId: string,
    @User() user: JwtPayload,
  ) {
    const userId = user.userId;
    return this.relasonshipService.sendFriendRequest(friendId, userId);
  }

  @Post(':friendId/accept-friend-request')
  acceptFriendRequest(
    @Param('friendId') friendId: string,
    @User() user: JwtPayload,
  ) {
    const userId = user.userId;
    return this.relasonshipService.acceptFriendRequest(friendId, userId);
  }

  @Post(':friendId/reject-friend-request')
  rejectFriendRequest(
    @Param('friendId') friendId: string,
    @User() user: JwtPayload,
  ) {
    const userId = user.userId;
    return this.relasonshipService.rejectFriendRequest(friendId, userId);
  }

  @Delete(':friendId/remove-friend')
  removeFriend(@Param('friendId') friendId: string, @User() user: JwtPayload) {
    const userId = user.userId;
    return this.relasonshipService.removeFriend(friendId, userId);
  }
  @Get('get-friends/:userId')
  getFriends(@Param('userId') userId: string) {
    return this.relasonshipService.getFriends(userId);
  }
}
