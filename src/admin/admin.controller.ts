import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Panel')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard) // <--- Doble protección: Login + Rol
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Roles('ADMIN') // <--- Solo ADMIN entra aquí
  @ApiOperation({ summary: 'Ver estadísticas globales' })
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar últimos usuarios' })
  listUsers(@Query('limit') limit: string) {
    return this.adminService.listUsers(Number(limit) || 20);
  }

  @Delete('users/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Banear usuario (Borrado forzoso)' })
  deleteUser(@Param('id') id: string, @Request() req) {
    // <--- Inyectar Request
    return this.adminService.deleteUser(id, req.user.userId); // <--- Pasar el ID
  }

  @Delete('content/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar contenido obsoleto o incorrecto' })
  deleteContent(@Param('id') id: string) {
    return this.adminService.deleteContent(id);
  }
}
