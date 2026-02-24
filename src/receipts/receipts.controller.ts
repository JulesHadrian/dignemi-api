import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Receipts (History)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Get()
  @ApiOperation({ summary: 'Ver historial de compras (Recibos)' })
  getMyReceipts(@Request() req) {
    return this.receiptsService.getMyReceipts(req.user.userId);
  }
}
