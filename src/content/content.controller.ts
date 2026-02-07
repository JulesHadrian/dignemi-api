import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Content Delivery')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt')) // Todo el contenido requiere login
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // --- Endpoints de Consumo (App) ---

  @Get('catalog')
  @ApiOperation({ summary: 'Obtener catálogo de rutas disponibles' })
  getCatalog() {
    return this.contentService.getCatalog();
  }

  @Get('routes/:id')
  @ApiOperation({ summary: 'Cargar una ruta completa con sus pasos' })
  getRoute(@Param('id') id: string) {
    return this.contentService.getRoute(id);
  }

  @Get('library')
  @ApiOperation({ summary: 'Biblioteca de recursos sueltos (ejercicios, articulos)' })
  @ApiQuery({ name: 'topic', required: false })
  @ApiQuery({ name: 'type', required: false, enum: ['exercise', 'article'] })
  getLibrary(@Query('topic') topic?: string, @Query('type') type?: string) {
    return this.contentService.getLibrary(topic, type);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Obtener un item específico (ejercicio/articulo)' })
  getItem(@Param('id') id: string) {
    return this.contentService.getItem(id);
  }

  // --- Endpoint de Gestión (Temporal para poblar DB) ---
  
  @Post()
  @ApiOperation({ summary: '[ADMIN/DEV] Crear contenido nuevo' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }
}