import { Controller, Get, Body, Put, UseGuards, Request } from '@nestjs/common';
import { ConsentService } from './consent.service';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Consent (Privacy)')
@ApiBearerAuth() // Indica a Swagger que estos endpoints requieren token
@UseGuards(AuthGuard('jwt')) // Protege todo el controlador
@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener configuración de privacidad actual' })
  getConsent(@Request() req) {
    // req.user viene del JwtStrategy que hicimos en el Módulo 2
    return this.consentService.getConsent(req.user.userId);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar configuración de privacidad' })
  updateConsent(@Request() req, @Body() updateConsentDto: UpdateConsentDto) {
    return this.consentService.updateConsent(req.user.userId, updateConsentDto);
  }
}
