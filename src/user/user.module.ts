import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { IdentityService } from './services/user-identity.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Identity, IdentitySchema } from './schema/user-identity.schema';
import { PrismaModule } from 'lib/data-access/prisma/prisma.module';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, IdentityService, PrismaService],
  exports: [UserService, IdentityService],
})
export class UserModule {}
