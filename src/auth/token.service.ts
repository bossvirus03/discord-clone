import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) { }
  async remove(refreshToken: string) {
    try {
      const token = await this.prisma.token.delete({
        where: { refreshToken },
      });
      //todo
    } catch (error) {
      if (error.errorCode === 'P2025') {
        throw new BadRequestException('Token not found');
      }
    }
  }
}
