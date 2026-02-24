import {
  Controller,
  Get,
  Delete,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Privacy (GDPR/Compliance)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('privacy')
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Get('export')
  @ApiOperation({ summary: 'Descargar todos los datos personales (JSON)' })
  async exportData(@Request() req) {
    return this.privacyService.exportUserData(req.user.userId);
  }

  @Delete('delete')
  @HttpCode(204) // 204 No Content (éxito sin cuerpo)
  @ApiOperation({ summary: 'ELIMINAR CUENTA PERMANENTEMENTE (Irreversible)' })
  async deleteAccount(@Request() req) {
    await this.privacyService.deleteAccount(req.user.userId);
    // No devolvemos nada, solo código 204
  }
}
