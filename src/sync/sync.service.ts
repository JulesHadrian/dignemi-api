import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConsentService } from '../consent/consent.service'; // Importamos el servicio de módulo 3
import { PushSyncDto, PullSyncDto } from './dto/sync.dto';

@Injectable()
export class SyncService {
  constructor(
    private prisma: PrismaService,
    private consentService: ConsentService,
  ) {}

  // Validar permiso antes de cualquier operación
  private async checkPermission(userId: string) {
    const consent = await this.consentService.getConsent(userId);
    if (!consent.sync) {
      throw new ForbiddenException('Sincronización desactivada por el usuario (Privacy settings)');
    }
  }

  // 1. PUSH: Recibir cambios del cliente y guardarlos
  async push(userId: string, dto: PushSyncDto) {
    await this.checkPermission(userId);

    const results: string[] = [];
    
    // Procesamos en transacción para consistencia (o bucle simple para MVP)
    // Usamos Upsert: si existe lo actualiza, si no lo crea.
    for (const change of dto.changes) {
      const record = await this.prisma.syncRecord.upsert({
        where: {
          userId_entityType_entityId: {
            userId,
            entityType: change.entityType,
            entityId: change.entityId,
          },
        },
        update: {
          data: change.data,
          deviceUpdatedAt: change.deviceUpdatedAt,
          isDeleted: change.isDeleted ?? false,
        },
        create: {
          userId,
          entityType: change.entityType,
          entityId: change.entityId,
          data: change.data,
          deviceUpdatedAt: change.deviceUpdatedAt,
          isDeleted: change.isDeleted ?? false,
        },
      });
      results.push(record.id);
    }

    return { processed: results.length, serverTime: new Date() };
  }

  // 2. PULL: Enviar al cliente lo que cambió en el servidor
  async pull(userId: string, dto: PullSyncDto) {
    await this.checkPermission(userId);

    const whereClause: any = { userId };

    // Si el cliente manda fecha, filtramos solo lo nuevo
    if (dto.lastSyncAt) {
      whereClause.serverUpdatedAt = {
        gt: new Date(dto.lastSyncAt), // "gt" = greater than (mayor que)
      };
    }

    const changes = await this.prisma.syncRecord.findMany({
      where: whereClause,
      select: {
        entityType: true,
        entityId: true,
        data: true,
        deviceUpdatedAt: true,
        serverUpdatedAt: true,
        isDeleted: true,
      },
    });

    return { changes, serverTime: new Date() };
  }
}