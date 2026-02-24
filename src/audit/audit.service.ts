import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logAction(
    adminId: string,
    action: string,
    targetId?: string,
    details?: string,
  ) {
    // Fire and forget (no esperamos await para no bloquear la respuesta principal si no es crítico)
    this.prisma.auditLog
      .create({
        data: {
          adminId,
          action,
          targetId,
          details,
        },
      })
      .catch((err) => console.error('Error writing audit log', err));
  }
}
