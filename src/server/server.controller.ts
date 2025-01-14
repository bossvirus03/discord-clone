import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto } from 'lib/shared/dto/server/create-server.dto';
import { UpdateServerDto } from 'lib/shared/dto/server/update-server.dto';
import { User } from 'lib/shared/decorators/customize.decorator';
import { JwtPayload } from 'lib/shared/type/jwt-payload.type';
import { ServerPermissionService } from './server-permission.service';
import { ServerDeleteRes, ServerRes } from 'lib/shared/responses/server/server-response.type';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService,
    private readonly serverPermissionService: ServerPermissionService) { }

  @Post()
  create(@Body() dto: CreateServerDto, @User() user: JwtPayload): Promise<ServerRes> {
    const { userId: ownerId } = user;
    return this.serverService.create(dto, ownerId);
  }

  @Get()
  findAll(): Promise<ServerRes[]> {
    return this.serverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ServerRes> {
    return this.serverService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServerDto): Promise<ServerRes> {
    return this.serverService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ServerDeleteRes> {
    return this.serverService.remove(id);
  }
}
