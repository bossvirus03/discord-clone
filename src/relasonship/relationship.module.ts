import { forwardRef, Module } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { RelationshipController } from './relationship.controller';
import { PrismaModule } from 'lib/data-access/prisma/prisma.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [PrismaModule, forwardRef(() => SocketModule)],

  controllers: [RelationshipController],
  providers: [RelationshipService],
  exports: [RelationshipService],
})
export class RelationshipModule { }
