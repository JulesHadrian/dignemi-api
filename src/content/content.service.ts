import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  // Helper privado para validar acceso a contenido premium
  private async validatePremiumAccess(userId: string, contentItem: any) {
    // Si el contenido es gratuito, permitir acceso
    if (!contentItem.isPremium) {
      return;
    }

    // Si es premium, verificar entitlement del usuario
    const entitlement = await this.prisma.subscriptionEntitlement.findUnique({
      where: { userId },
    });

    // Validar que tiene suscripción activa o en trial
    if (!entitlement || (entitlement.status !== 'ACTIVE' && entitlement.status !== 'TRIAL')) {
      throw new ForbiddenException(
        'Este contenido es premium. Necesitas una suscripción activa para acceder.',
      );
    }

    // Si está en ACTIVE, validar que no haya expirado
    if (entitlement.status === 'ACTIVE' && entitlement.expiresAt) {
      if (new Date() > entitlement.expiresAt) {
        throw new ForbiddenException('Tu suscripción ha expirado. Renueva para acceder a contenido premium.');
      }
    }
  }

  // 1. Obtener Catálogo (Todo lo que sea 'route' publicado)
  async getCatalog(userId: string, locale: string = 'es-LATAM') {
    // Verificar si el usuario tiene acceso premium
    const entitlement = await this.prisma.subscriptionEntitlement.findUnique({
      where: { userId },
    });

    const hasPremiumAccess =
      entitlement &&
      (entitlement.status === 'ACTIVE' || entitlement.status === 'TRIAL') &&
      (!entitlement.expiresAt || new Date() <= entitlement.expiresAt);

    const routes = await this.prisma.contentItem.findMany({
      where: {
        type: 'route',
        isPublished: true,
        locale,
        // Si no tiene premium, solo mostrar contenido gratuito
        ...(!hasPremiumAccess && { isPremium: false }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        version: true,
        isPremium: true, // Incluir para que el cliente sepa si es premium
      },
    });

    return routes;
  }

  // 2. Obtener una Ruta específica por ID (con todo su body)
  async getRoute(id: string, userId: string) {
    const route = await this.prisma.contentItem.findUnique({
      where: { id },
    });

    if (!route || route.type !== 'route') {
      throw new NotFoundException('Ruta no encontrada');
    }

    // Validar acceso premium
    await this.validatePremiumAccess(userId, route);

    return route;
  }

  // 3. Biblioteca: Buscar ejercicios o artículos por tema
  async getLibrary(userId: string, topic?: string, type?: string) {
    // Verificar si el usuario tiene acceso premium
    const entitlement = await this.prisma.subscriptionEntitlement.findUnique({
      where: { userId },
    });

    const hasPremiumAccess =
      entitlement &&
      (entitlement.status === 'ACTIVE' || entitlement.status === 'TRIAL') &&
      (!entitlement.expiresAt || new Date() <= entitlement.expiresAt);

    return this.prisma.contentItem.findMany({
      where: {
        isPublished: true,
        // Si vienen parámetros, filtramos. Si no, trae todo.
        ...(topic && { topic }),
        ...(type && { type }),
        // Si no tiene premium, solo mostrar contenido gratuito
        ...(!hasPremiumAccess && { isPremium: false }),
      },
    });
  }

  // 4. Detalle de ejercicio/artículo
  async getItem(id: string, userId: string) {
    const item = await this.prisma.contentItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException('Contenido no encontrado');
    }

    // Validar acceso premium
    await this.validatePremiumAccess(userId, item);

    return item;
  }

  // 5. [DEV/ADMIN] Crear contenido (Para poder poblar la DB)
  async create(dto: CreateContentDto) {
    return this.prisma.contentItem.create({
      data: {
        ...dto,
        // Prisma maneja JSON nativo, pasamos el objeto directo
      },
    });
  }

  // 6. [DEV/ADMIN] Actualizar contenido existente
  async update(id: string, dto: UpdateContentDto) {
    // Verificar que el contenido existe
    const existingContent = await this.prisma.contentItem.findUnique({
      where: { id },
    });

    if (!existingContent) {
      throw new NotFoundException(`Contenido con ID ${id} no encontrado`);
    }

    // Actualizar el contenido
    return this.prisma.contentItem.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }
}