import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostHog } from 'posthog-node';

@Injectable()
export class FlagsService implements OnModuleInit {
  private client: PostHog | null = null;

  // DEFINICIÓN DE FLAGS POR DEFECTO (Modo Local)
  // Aquí defines qué valores devolver si no hay conexión con PostHog
  private readonly defaultFlags = {
    'show-new-onboarding': 'variant-a', // variante A vs B
    'paywall-delay-seconds': 5, // valor numérico
    'enable-christmas-theme': false, // toggle simple
  };

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('POSTHOG_API_KEY');
    const host = this.configService.get<string>('POSTHOG_HOST');

    if (apiKey) {
      this.client = new PostHog(apiKey, { host });
      console.log('🚩 PostHog inicializado correctamente');
    } else {
      console.log(
        '⚠️ PostHog no configurado. Usando flags locales (Mock Mode).',
      );
    }
  }

  async getFlags(userId: string) {
    // Si tenemos cliente real, consultamos a PostHog
    if (this.client) {
      try {
        // Obtenemos todas las flags activas para este usuario
        const flags = await this.client.getAllFlags(userId);
        return flags;
      } catch (error) {
        console.error('Error fetching flags from PostHog:', error);
        // Fallback a defaults en caso de error de red
        return this.defaultFlags;
      }
    }

    // Si no hay cliente (modo dev/local), devolvemos los defaults
    return this.defaultFlags;
  }
}
