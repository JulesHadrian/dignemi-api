import { Module } from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { PrivacyController } from './privacy.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PrivacyController],
  providers: [PrivacyService, PrismaService],
})
export class PrivacyModule {}
