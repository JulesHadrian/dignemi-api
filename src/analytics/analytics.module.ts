import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ConsentModule } from '../consent/consent.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConsentModule, ConfigModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}