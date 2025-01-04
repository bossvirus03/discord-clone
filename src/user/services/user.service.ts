import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { Identity } from '@discord-clone/DiscordClone';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const { name } = createUserDto;
    return this.prismaService.user.create({
      data: {
        name,
        identity: {
          create: {
            username: createUserDto.username,
            email: createUserDto.email,
            password: createUserDto.password,
          },
        },
      },
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: string) {
    // return this.identityModel.findById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
