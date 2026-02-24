import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto/track-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Analytics Proxy')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Enviar evento de analítica (sujeto a consentimiento)',
  })
  track(@Request() req, @Body() dto: TrackEventDto) {
    return this.analyticsService.trackEvent(req.user.userId, dto);
  }
}
