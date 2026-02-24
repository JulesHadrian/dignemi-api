import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ValidatePurchaseDto } from './dto/validate-purchase.dto';

@Injectable()
export class EntitlementsService {
  constructor(private prisma: PrismaService) {}

  // 1. Obtener estado actual
  async getStatus(userId: string) {
    const entitlement = await this.prisma.subscriptionEntitlement.findUnique({
      where: { userId },
    });

    if (!entitlement) {
      return { status: 'FREE', expiresAt: null };
    }

    // Lógica extra: Si ya pasó la fecha, marcar como expirado visualmente
    if (entitlement.expiresAt && new Date() > entitlement.expiresAt) {
      return { ...entitlement, status: 'EXPIRED' };
    }

    return entitlement;
  }

  // 2. Validar compra (Simulación para MVP)
  async validatePurchase(userId: string, dto: ValidatePurchaseDto) {
    // --- SIMULACIÓN DE VALIDACIÓN EXTERNA ---
    // En producción, aquí usarías librerías como 'google-play-billing-validator' o 'apple-receipt-verify'
    const isMockValid = dto.receipt !== 'recibo_invalido';

    if (!isMockValid) {
      await this.logReceipt(userId, dto, 'INVALID');
      throw new BadRequestException('La tienda rechazó el recibo');
    }
    // ----------------------------------------

    // Si es válido, calculamos fecha de expiración (ej: +1 mes desde hoy)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // 1. Guardar recibo en historial
    await this.logReceipt(userId, dto, 'VALID');

    // 2. Actualizar o crear el entitlement del usuario
    const entitlement = await this.prisma.subscriptionEntitlement.upsert({
      where: { userId },
      update: {
        status: 'ACTIVE',
        platform: dto.platform,
        productId: dto.productId,
        expiresAt: expiresAt,
      },
      create: {
        userId,
        status: 'ACTIVE',
        platform: dto.platform,
        productId: dto.productId,
        expiresAt: expiresAt,
      },
    });

    return entitlement;
  }

  // Helper para guardar log
  private async logReceipt(
    userId: string,
    dto: ValidatePurchaseDto,
    status: string,
  ) {
    await this.prisma.purchaseReceipt.create({
      data: {
        userId,
        platform: dto.platform,
        productId: dto.productId,
        transactionId: `mock_trans_${Date.now()}`, // Simulado
        rawReceipt: dto.receipt,
        status,
      },
    });
  }
}
