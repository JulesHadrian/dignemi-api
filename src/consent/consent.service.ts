import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateConsentDto } from './dto/update-consent.dto';

@Injectable()
export class ConsentService {
  constructor(private prisma: PrismaService) {}

  // Obtener consentimiento actual (o devolver defaults si no existe)
  async getConsent(userId: string) {
    const consent = await this.prisma.consent.findUnique({
      where: { userId },
    });

    if (!consent) {
      // Si nunca ha guardado nada, devolvemos todo en falso (privacidad por defecto)
      return {
        analytics: false,
        sync: false,
        policyVersion: '1.0',
      };
    }
    return consent;
  }

  // Actualizar o Crear consentimiento
  async updateConsent(userId: string, dto: UpdateConsentDto) {
    return this.prisma.consent.upsert({
      where: { userId },
      update: {
        ...dto,
      },
      create: {
        userId,
        analytics: dto.analytics ?? false,
        sync: dto.sync ?? false,
        policyVersion: dto.policyVersion ?? '1.0',
      },
    });
  }
}