import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TelemetrySchema, Telemetry } from './schemas/telemetry.schema';
import Redis from 'ioredis';
import { IngestTokenGuard } from '../guards/ingest-token.guard';
import configuration from '../config/configuration';

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
