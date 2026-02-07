import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { HelpService } from './help.service';
import { CreateHelpResourceDto } from './dto/create-resource.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Request } from '@nestjs/common';

@ApiTags('Help Resources')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard) // Base protection
@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  // --- PUBLICO (Para usuarios autenticados) ---

  @Get('resources')
  @ApiOperation({ summary: 'Obtener teléfonos de ayuda (Usa param country O el del perfil del usuario)' })
  @ApiQuery({ name: 'country', required: false, example: 'MX' }) // <--- Ahora es required: false
  async getResources(@Request() req, @Query('country') countryQuery?: string) {
    // 1. Prioridad: ¿La App mandó un país específico?
    if (countryQuery) {
      return this.helpService.findByCountry(countryQuery);
    }

    // 2. Si no, usamos el del usuario logueado
    // Nota: req.user viene del JwtStrategy. Si agregamos 'country' al payload del token se leería directo.
    // Pero como quizás no está en el token, podemos asumir un default o buscar en DB.
    
    // Para MVP, vamos a asumir que si no hay query, usamos el del usuario si existe, o 'MX' por defecto.
    // (Para que esto sea perfecto, deberíamos agregar 'country' al JWT Payload en AuthService, 
    // pero por ahora usaremos un fallback simple).
    
    // Simulación de lógica robusta:
    const userCountry = req.user.country || 'MX'; // Fallback a México para el MVP
    
    return this.helpService.findByCountry(userCountry);
  }

  // --- ADMIN ONLY ---

  @Post()
  @Roles('ADMIN') // <--- Solo tú puedes crear
  @ApiOperation({ summary: '[ADMIN] Agregar nuevo recurso de ayuda' })
  create(@Body() dto: CreateHelpResourceDto) {
    return this.helpService.create(dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '[ADMIN] Eliminar recurso' })
  delete(@Param('id') id: string) {
    return this.helpService.delete(id);
  }
}