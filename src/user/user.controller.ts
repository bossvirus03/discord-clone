import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDto } from '../../lib/shared/dto/user/create-user.dto';
import { UpdateUserDto } from '../../lib/shared/dto/user/update-user.dto';
import { UpdateStatusUserDto } from 'lib/shared/dto/user/update-status-user.dto';
import { UserCreationRes, UserDeleteRes, UserRes, UserUpdateRes } from 'lib/shared/responses/user/user-response.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<UserCreationRes> {
    return this.userService.create(dto);
  }

  @Get()
  findAll(): Promise<UserRes[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserRes> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserUpdateRes> {
    return this.userService.update(id, dto);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusUserDto): Promise<UserUpdateRes> {
    return this.userService.updateStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<UserDeleteRes> {
    return this.userService.remove(id);
  }
}
