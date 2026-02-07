import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReceiptsService {
  constructor(private prisma: PrismaService) {}

  // Obtener historial de recibos del usuario
  async getMyReceipts(userId: string) {
    return this.prisma.purchaseReceipt.findMany({
      where: { userId },
      orderBy: { validatedAt: 'desc' },
      select: {
        id: true,
        productId: true,
        platform: true,
        validatedAt: true,
        status: true,
        // No devolvemos 'rawReceipt' ni 'transactionId' por seguridad/limpieza
      },
    });
  }
}