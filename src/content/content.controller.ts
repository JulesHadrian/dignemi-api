import { Controller, Get, Post, Body, Param, Query, UseGuards, Patch } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthUser } from '../common/interfaces/auth-user.interface';

@ApiTags('Content Delivery')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt')) // Todo el contenido requiere login
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // --- Endpoints de Consumo (App) ---

  @Get('catalog')
  @ApiOperation({ summary: 'Obtener catálogo de rutas disponibles (filtra por acceso premium)' })
  getCatalog(@CurrentUser() user: AuthUser) {
    return this.contentService.getCatalog(user.userId);
  }

  @Get('routes/:id')
  @ApiOperation({ summary: 'Cargar una ruta completa con sus pasos (valida acceso premium)' })
  getRoute(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.contentService.getRoute(id, user.userId);
  }

  @Get('library')
  @ApiOperation({ summary: 'Biblioteca de recursos sueltos (filtra por acceso premium)' })
  @ApiQuery({ name: 'topic', required: false })
  @ApiQuery({ name: 'type', required: false, enum: ['exercise', 'article'] })
  getLibrary(
    @CurrentUser() user: AuthUser,
    @Query('topic') topic?: string,
    @Query('type') type?: string,
  ) {
    return this.contentService.getLibrary(user.userId, topic, type);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Obtener un item específico (valida acceso premium)' })
  getItem(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.contentService.getItem(id, user.userId);
  }

  // --- Endpoints de Gestión (ADMIN/DEV para poblar DB) ---

  @Post()
  @ApiOperation({ summary: '[ADMIN/DEV] Crear contenido nuevo' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[ADMIN/DEV] Actualizar contenido existente' })
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(id, updateContentDto);
  }
}