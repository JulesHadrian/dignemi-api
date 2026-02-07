import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateHelpResourceDto } from './dto/create-resource.dto';

@Injectable()
export class HelpService {
  constructor(private prisma: PrismaService) {}

  // 1. Obtener recursos (Usuario)
  async findByCountry(countryCode: string) {
    // Normalizamos a mayúsculas
    const country = countryCode.toUpperCase();

    // Buscamos recursos específicos del país
    let resources = await this.prisma.helpResource.findMany({
      where: { country },
      orderBy: { isEmergency: 'desc' }, // Emergencias primero
    });

    // LOGICA DE FALLBACK:
    // Si no hay recursos para ese país, buscamos los 'GLOBAL'
    if (resources.length === 0) {
      resources = await this.prisma.helpResource.findMany({
        where: { country: 'GLOBAL' },
        orderBy: { isEmergency: 'desc' },
      });
    }

    return resources;
  }

  // 2. Crear recurso (Admin)
  async create(dto: CreateHelpResourceDto) {
    return this.prisma.helpResource.create({
      data: {
        ...dto,
        country: dto.country.toUpperCase(),
      },
    });
  }

  // 3. Borrar recurso (Admin)
  async delete(id: string) {
      return this.prisma.helpResource.delete({ where: { id }});
  }
}