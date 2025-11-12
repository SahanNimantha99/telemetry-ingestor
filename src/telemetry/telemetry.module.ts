import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { TelemetrySchema, Telemetry } from './schemas/telemetry.schema';

import configuration from '../config/configuration';
import { IngestTokenGuard } from '../guards/ingest-token.guard';

function getEnv(key: string, fallback?: string): string {
  const val = process.env[key] || fallback;
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
}

@Module({
  imports: [MongooseModule.forFeature([{ name: Telemetry.name, schema: TelemetrySchema }])],
  controllers: [TelemetryController],
  providers: [
    TelemetryService,
    IngestTokenGuard,
    {
      provide: 'REDIS',
      useFactory: () => {
        return new Redis(getEnv('REDIS_URL', configuration().REDIS_URL));
      },
    },
  ],
})
export class TelemetryModule {}
