import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateContentDto } from './dto/create-content.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  // 1. Obtener Catálogo (Todo lo que sea 'route' publicado)
  async getCatalog(locale: string = 'es-LATAM') {
    return this.prisma.contentItem.findMany({
      where: { 
        type: 'route', 
        isPublished: true,
        locale 
      },
      select: { id: true, title: true, description: true, topic: true, version: true } // Proyección ligera
    });
  }

  // 2. Obtener una Ruta específica por ID (con todo su body)
  async getRoute(id: string) {
    const route = await this.prisma.contentItem.findUnique({
      where: { id },
    });
    if (!route || route.type !== 'route') throw new NotFoundException('Ruta no encontrada');
    return route;
  }

  // 3. Biblioteca: Buscar ejercicios o artículos por tema
  async getLibrary(topic?: string, type?: string) {
    return this.prisma.contentItem.findMany({
      where: {
        isPublished: true,
        // Si vienen parámetros, filtramos. Si no, trae todo.
        ...(topic && { topic }),
        ...(type && { type }),
      },
    });
  }

  // 4. Detalle de ejercicio/artículo
  async getItem(id: string) {
    const item = await this.prisma.contentItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Contenido no encontrado');
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
}