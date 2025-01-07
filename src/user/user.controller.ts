import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDto } from '../../lib/shared/dto/user/create-user.dto';
import { UpdateUserDto } from '../../lib/shared/dto/user/update-user.dto';
import { SendFriendRequestDto } from 'lib/shared/dto/friend/friend-request.dto';
import { User } from 'lib/shared/decorators/customize.decorator';
import { JwtPayload } from 'lib/shared/type/jwt-payload.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('send-friend-request')
  sendFriendRequest(
    @Body() sendFriendRequestDto: SendFriendRequestDto,
    @User() user: JwtPayload,
  ) {
    const userId = user.userId;
    return this.userService.sendFriendRequest(sendFriendRequestDto, userId);
  }

  @Post('accept-friend-request')
  acceptFriendRequest(
    @Body() sendFriendRequestDto: SendFriendRequestDto,
    @User() user: JwtPayload,
  ) {
    const userId = user.userId;
    return this.userService.acceptFriendRequest(sendFriendRequestDto, userId);
  }

  @Post('reject-friend-request')
  rejectFriendRequest(
    @Body() sendFriendRequestDto: SendFriendRequestDto,
    @User() user: JwtPayload,
  ) {
    const userId = user.userId;
    return this.userService.rejectFriendRequest(sendFriendRequestDto, userId);
  }

  @Delete('remove-friend')
  removeFriend(
    @Body() sendFriendRequestDto: SendFriendRequestDto,
    @User() user: JwtPayload,
  ) {
    const userId = user.userId;
    return this.userService.removeFriend(sendFriendRequestDto, userId);
  }
  @Get('get-friends/:userId')
  getFriends(@Param('userId') userId: string) {
    return this.userService.getFriends(userId);
  }
}
