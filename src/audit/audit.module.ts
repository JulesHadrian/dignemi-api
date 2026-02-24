import { Module, Global } from '@nestjs/common'; // <--- OJO: Global
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma.service';

@Global() // Hacemos este módulo Global para no tener que importarlo en todos lados
@Module({
  providers: [AuditService, PrismaService],
  exports: [AuditService],
})
export class AuditModule {}
