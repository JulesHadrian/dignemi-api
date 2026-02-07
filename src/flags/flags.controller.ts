import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { FlagsService } from './flags.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Feature Flags')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('flags')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener feature flags y variantes para el usuario actual' })
  getFlags(@Request() req) {
    // Usamos el userId del token para asegurar consistencia (siempre devuelve lo mismo al mismo usuario)
    return this.flagsService.getFlags(req.user.userId);
  }
}