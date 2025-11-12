import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Module } from '@nestjs/common';
import Redis from 'ioredis';

import configuration from './config/configuration';
import { HealthController } from './health/health.controller';
import { TelemetryModule } from './telemetry/telemetry.module';

function getEnv(key: string, fallback?: string): string {
  const val = process.env[key] || fallback;
  if (!val) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return val;
}

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    MongooseModule.forRoot(getEnv('MONGO_URI', configuration().MONGO_URI)),
    TelemetryModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        return new Redis(getEnv('REDIS_URL', configuration().REDIS_URL));
      },
    },
  ],
})
export class AppModule {}
