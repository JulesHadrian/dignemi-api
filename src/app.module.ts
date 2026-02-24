import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.validation';
import { PrismaService } from './prisma.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EntitlementsModule } from './entitlements/entitlements.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { ContentModule } from './content/content.module';
import { SyncModule } from './sync/sync.module';
import { FlagsModule } from './flags/flags.module';
import { ConsentModule } from './consent/consent.module';
import { AdminModule } from './admin/admin.module';
import { AuditModule } from './audit/audit.module';
import { HealthModule } from './health/health.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PrivacyModule } from './privacy/privacy.module';
import { HelpModule } from './help/help.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en todo el sistema sin re-importar
      validationSchema: envSchema,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    EntitlementsModule,
    ReceiptsModule,
    ContentModule,
    SyncModule,
    FlagsModule,
    ConsentModule,
    AdminModule,
    AuditModule,
    HealthModule,
    AnalyticsModule,
    PrivacyModule,
    HelpModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
