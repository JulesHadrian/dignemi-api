import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { PushSyncDto, PullSyncDto } from './dto/sync.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Data Sync (Backup)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('push')
  @HttpCode(200)
  @ApiOperation({ summary: 'Subir cambios locales al servidor' })
  push(@Request() req, @Body() dto: PushSyncDto) {
    return this.syncService.push(req.user.userId, dto);
  }

  @Post('pull')
  @HttpCode(200)
  @ApiOperation({ summary: 'Descargar cambios remotos desde la última vez' })
  pull(@Request() req, @Body() dto: PullSyncDto) {
    return this.syncService.pull(req.user.userId, dto);
  }
}
