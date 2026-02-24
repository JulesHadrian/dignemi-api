import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  // 1. Estadísticas básicas del sistema
  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count();
    const premiumUsers = await this.prisma.subscriptionEntitlement.count({
      where: { status: 'ACTIVE' },
    });
    const totalContent = await this.prisma.contentItem.count();

    return {
      users: { total: totalUsers, premium: premiumUsers },
      content: totalContent,
      generatedAt: new Date(),
    };
  }

  // 2. Moderación: Listar usuarios
  async listUsers(limit = 20) {
    return this.prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, role: true, createdAt: true }, // No passwords ni hashes
    });
  }

  // 3. Moderación: Banear/Borrar usuario
  async deleteUser(userId: string, adminId: string) {
    // <--- Pedimos adminId
    const result = await this.prisma.user.delete({ where: { id: userId } });

    await this.auditService.logAction(
      adminId,
      'DELETE_USER',
      userId,
      `User email: ${result.email}`,
    );

    return result;
  }

  // 4. Contenido: Borrar contenido (para limpiar errores)
  async deleteContent(contentId: string) {
    return this.prisma.contentItem.delete({ where: { id: contentId } });
  }
}
