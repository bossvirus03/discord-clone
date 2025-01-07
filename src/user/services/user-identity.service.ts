import { Injectable } from '@nestjs/common';
import { CreateUserIdentityDto } from '../../../lib/shared/dto/user/create-user-identity.dto';
import { UpdateUserIdentityDto } from '../../../lib/shared/dto/user/update-user-identity.dto';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';

@Injectable()
export class IdentityService {
  constructor(private prisma: PrismaService) {}

  async exists(usernameOrEmail: string) {
    return await this.prisma.identity.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
  }
  create(createIdentityDto: CreateUserIdentityDto) {
    return this.prisma.identity.create({ data: createIdentityDto });
  }

  findAll() {
    return `This action returns all identity`;
  }

  async findByUsernameOrEmail(usernameOrEmail: string) {
    return await this.prisma.identity.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
  }

  findOne(usernameOrEmail: string) {}

  update(id: number, updateIdentityDto: UpdateUserIdentityDto) {
    return `This action updates a #${id} identity`;
  }

  remove(id: number) {
    return `This action removes a #${id} identity`;
  }
}
