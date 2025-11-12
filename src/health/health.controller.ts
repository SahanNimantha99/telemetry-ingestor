import { Controller, Get, Inject } from '@nestjs/common';

import { Connection, ConnectionStates } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

import { logger } from '../common/logger';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly conn: Connection,
    @Inject('REDIS') private readonly redis: any
  ) {}

  @Get()
  async health() {
    const mongoOk = this.conn.readyState === ConnectionStates.connected;
    let redisStatus = 'unknown';
    try {
      const pong = await this.redis.ping();
      redisStatus = pong;
    } catch (err) {
      redisStatus = 'error';
    }
    const out = { mongo: mongoOk ? 'ok' : 'down', redis: redisStatus };
    logger.info('health', out);
    return out;
  }
}
