import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health & Monitoring')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Verificar estado del sistema (DB + Memoria)' })
  check() {
    return this.health.check([
      // 1. Verificar conexión a Base de Datos
      () => this.prismaHealth.isHealthy('database'),

      // 2. Verificar que no estemos saturando la memoria RAM (ej: límite 150MB)
      // Ajusta el número según tu servidor (150 * 1024 * 1024)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
