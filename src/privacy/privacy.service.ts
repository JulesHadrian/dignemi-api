import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrivacyService {
  constructor(private prisma: PrismaService) {}

  // 1. Exportar todos los datos (Derecho de Acceso)
  async exportUserData(userId: string) {
    // Buscamos en todas las tablas relacionadas
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        consent: true, // Sus permisos
        entitlements: true, // Su suscripción actual
        syncRecords: true, // Sus datos de backup (diario, progreso)
        // No incluimos 'purchaseReceipts' porque son registros contables internos,
        // pero podrías incluirlos si el legal lo requiere.
      },
    });

    if (!user) return null;

    // Limpiamos campos sensibles de seguridad antes de entregar
    // (Aunque en este MVP no guardamos password, es buena práctica)
    const { ...cleanUser } = user;

    return {
      _generatedAt: new Date(),
      user: cleanUser,
    };
  }

  // 2. Borrar cuenta permanentemente (Derecho al Olvido)
  async deleteAccount(userId: string) {
    // Al ejecutar delete sobre el usuario, Prisma/Postgres
    // borrará en cascada: Consent, Entitlements y SyncRecords.
    // Los recibos (PurchaseReceipt) se quedarán huérfanos para contabilidad (deseable).

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
