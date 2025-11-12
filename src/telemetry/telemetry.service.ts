import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Telemetry, TelemetryDocument } from './schemas/telemetry.schema';
import { IngestTelemetryDto } from './dto/ingest-telemetry.dto';
import { InjectModel } from '@nestjs/mongoose';
import { latestKey, makeAlertDedupeKey, makeIngestKey } from '../utils/rate-limit';
import axios from 'axios';
import { logger } from '../common/logger';

@Injectable()
export class TelemetryService {
  private alertWebhook = process.env.ALERT_WEBHOOK_URL;
  constructor(
    @InjectModel(Telemetry.name) private telemetryModel: Model<TelemetryDocument>,
    @Inject('REDIS') private readonly redis: any
  ) {}

  // handle single item
  async ingestSingle(dto: IngestTelemetryDto) {
    // Persist
    const tsDate = new Date(dto.ts);
    const doc = await new this.telemetryModel({
      deviceId: dto.deviceId,
      siteId: dto.siteId,
      ts: tsDate,
      metrics: dto.metrics,
    }).save();

    // cache latest
    const key = latestKey(dto.deviceId);
    await this.redis.set(
      key,
      JSON.stringify({
        deviceId: dto.deviceId,
        siteId: dto.siteId,
        ts: dto.ts,
        metrics: dto.metrics,
      })
    );

    // Rate-limit ingest per device -- simple sliding: set key if not exists with TTL 1s (prevents flooding)
    // (If you need more advanced rate limit, use Redis tokens)
    await this.redis.set(makeIngestKey(dto.deviceId), '1', 'EX', 1);

    // Alert rules
    const { temperature, humidity } = dto.metrics;
    if (temperature > 50) await this.maybeSendAlert(dto, 'HIGH_TEMPERATURE', temperature);
    if (humidity > 90) await this.maybeSendAlert(dto, 'HIGH_HUMIDITY', humidity);

    return doc;
  }

  async ingestMany(dtos: IngestTelemetryDto[]) {
    const saves = dtos.map((d) => this.ingestSingle(d));
    return Promise.all(saves);
  }

  async maybeSendAlert(dto: IngestTelemetryDto, reason: string, value: number) {
    if (!this.alertWebhook) {
      logger.info('ALERT webhook not configured; skipping alert', {
        deviceId: dto.deviceId,
        reason,
      });
      return;
    }
    const dedupeKey = makeAlertDedupeKey(dto.deviceId, reason);
    const already = await this.redis.get(dedupeKey);
    if (already) {
      logger.info('Alert deduped', { deviceId: dto.deviceId, reason });
      return;
    }

    // send
    try {
      await axios.post(
        this.alertWebhook,
        {
          deviceId: dto.deviceId,
          siteId: dto.siteId,
          ts: dto.ts,
          reason,
          value,
        },
        { timeout: 5000 }
      );
      // set dedupe TTL 60 seconds
      await this.redis.set(dedupeKey, '1', 'EX', 60);
      logger.info('Alert sent', { deviceId: dto.deviceId, reason });
    } catch (err: any) {
      logger.error('Alert send failed', { deviceId: dto.deviceId, reason, err: err?.message });
    }
  }

  async getLatest(deviceId: string) {
    const key = latestKey(deviceId);
    const cached = await this.redis.get(key);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        /* ignore */
      }
    }
    // fallback to mongo (latest by ts)
    const doc = await this.telemetryModel.findOne({ deviceId }).sort({ ts: -1 }).lean();
    if (!doc) return null;
    const resp = {
      deviceId: doc.deviceId,
      siteId: doc.siteId,
      ts: doc.ts.toISOString(),
      metrics: doc.metrics,
    };
    // update cache
    await this.redis.set(key, JSON.stringify(resp));
    return resp;
  }

  async siteSummary(siteId: string, from: string, to: string) {
    const fromD = new Date(from);
    const toD = new Date(to);
    const pipeline = [
      { $match: { siteId, ts: { $gte: fromD, $lte: toD } } },
      {
        $group: {
          _id: '$siteId',
          count: { $sum: 1 },
          avgTemperature: { $avg: '$metrics.temperature' },
          maxTemperature: { $max: '$metrics.temperature' },
          avgHumidity: { $avg: '$metrics.humidity' },
          maxHumidity: { $max: '$metrics.humidity' },
          uniqueDevices: { $addToSet: '$deviceId' },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          avgTemperature: 1,
          maxTemperature: 1,
          avgHumidity: 1,
          maxHumidity: 1,
          uniqueDevices: { $size: '$uniqueDevices' },
        },
      },
    ];
    const res = await this.telemetryModel.aggregate(pipeline);
    return (
      res[0] || {
        count: 0,
        avgTemperature: null,
        maxTemperature: null,
        avgHumidity: null,
        maxHumidity: null,
        uniqueDevices: 0,
      }
    );
  }
}
