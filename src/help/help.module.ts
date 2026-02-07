import { Module } from '@nestjs/common';
import { HelpService } from './help.service';
import { HelpController } from './help.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [HelpController],
  providers: [HelpService, PrismaService],
})
export class HelpModule {}