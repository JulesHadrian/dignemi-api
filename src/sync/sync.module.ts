import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { PrismaService } from '../prisma.service';
import { ConsentModule } from '../consent/consent.module'; // Importante

@Module({
  imports: [ConsentModule], // Importamos el módulo completo
  controllers: [SyncController],
  providers: [SyncService, PrismaService],
})
export class SyncModule {}