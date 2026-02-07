import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostHog } from 'posthog-node';
import { ConsentService } from '../consent/consent.service';
import { TrackEventDto } from './dto/track-event.dto';

@Injectable()
export class AnalyticsService implements OnModuleInit {
  private client: PostHog | null = null;

  constructor(
    private configService: ConfigService,
    private consentService: ConsentService,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('POSTHOG_API_KEY');
    const host = this.configService.get<string>('POSTHOG_HOST');

    if (apiKey) {
      this.client = new PostHog(apiKey, { host });
    }
  }

  async trackEvent(userId: string, dto: TrackEventDto) {
    // 1. Verificación Estricta de Consentimiento
    const consent = await this.consentService.getConsent(userId);
    if (!consent.analytics) {
      // Si el usuario dijo NO, abortamos silenciosamente.
      // Esto es privacidad por diseño.
      return { status: 'skipped', reason: 'no_consent' };
    }

    // 2. Gobernanza de Datos (Sanitización básica)
    // Evitamos enviar propiedades que parezcan texto libre o PII obvio si se colaron
    const safeProperties = { ...dto.properties };
    
    // Ejemplo: Si por error la app manda 'email' en las propiedades, lo borramos
    delete safeProperties['email']; 
    delete safeProperties['password'];
    delete safeProperties['diary_content']; // Nunca enviar contenido del diario

    // 3. Enviar a PostHog (si está configurado)
    if (this.client) {
      this.client.capture({
        distinctId: userId,
        event: dto.event,
        properties: {
          ...safeProperties,
          $source: 'backend-proxy', // Marca para saber que vino del server
        },
      });
    } else {
      console.log(`[Analytics Mock] Event: ${dto.event} | User: ${userId}`);
    }

    return { status: 'queued' };
  }
}