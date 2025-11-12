import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { IngestTelemetryDto } from './dto/ingest-telemetry.dto';
import { IngestTokenGuard } from '../guards/ingest-token.guard';
import { logger } from '../common/logger';

@Controller('api/v1')
export class TelemetryController {
  constructor(private readonly svc: TelemetryService) {}

  @UseGuards(IngestTokenGuard)
  @Post('telemetry')
  @HttpCode(HttpStatus.CREATED)
  async ingest(@Body() body: any) {
    // Accept single or array
    try {
      if (Array.isArray(body)) {
        const dtos = body as IngestTelemetryDto[];
        const res = await this.svc.ingestMany(dtos);
        return { accepted: res.length };
      } else {
        const dto = body as IngestTelemetryDto;
        await this.svc.ingestSingle(dto);
        return { accepted: 1 };
      }
    } catch (err: any) {
      logger.error('Ingest failed', { err: err?.message });
      throw err;
    }
  }

  @Get('devices/:deviceId/latest')
  async getLatest(@Param('deviceId') deviceId: string) {
    const x = await this.svc.getLatest(deviceId);
    if (!x) return { message: 'not found' };
    return x;
  }

  @Get('sites/:siteId/summary')
  async siteSummary(
    @Param('siteId') siteId: string,
    @Query('from') from: string,
    @Query('to') to: string
  ) {
    const out = await this.svc.siteSummary(siteId, from, to);
    return out;
  }
}
