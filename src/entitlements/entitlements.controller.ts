import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EntitlementsService } from './entitlements.service';
import { ValidatePurchaseDto } from './dto/validate-purchase.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Subscriptions (B2C)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('entitlements')
export class EntitlementsController {
  constructor(private readonly entitlementsService: EntitlementsService) {}

  @Get()
  @ApiOperation({ summary: 'Verificar si el usuario es Premium o Free' })
  getStatus(@Request() req) {
    return this.entitlementsService.getStatus(req.user.userId);
  }

  @Post('purchase/validate')
  @ApiOperation({ summary: 'Validar recibo de Apple/Google y activar Premium' })
  validatePurchase(@Request() req, @Body() dto: ValidatePurchaseDto) {
    return this.entitlementsService.validatePurchase(req.user.userId, dto);
  }
}