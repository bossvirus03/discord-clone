import { forwardRef, Module } from '@nestjs/common';
import { RelasonshipService } from './relasonship.service';
import { RelasonshipController } from './relasonship.controller';
import { PrismaModule } from 'lib/data-access/prisma/prisma.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [PrismaModule, forwardRef(() => SocketModule)],

  controllers: [RelasonshipController],
  providers: [RelasonshipService],
  exports: [RelasonshipService],
})
export class RelasonshipModule {}
