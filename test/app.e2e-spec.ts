import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';

describe('E2E Telemetry (basic)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/telemetry (single) -> created and then latest', async () => {
    const payload = {
      deviceId: 'e2e-dev-1',
      siteId: 'e2e-site',
      ts: new Date().toISOString(),
      metrics: { temperature: 55, humidity: 50 },
    };
    const token = process.env.INGEST_TOKEN;
    const res = await request(app.getHttpServer())
      .post('/api/v1/telemetry')
      .set('Authorization', token ? `Bearer ${token}` : '')
      .send(payload)
      .expect(201);
    expect(res.body.accepted).toBeDefined();

    const latest = await request(app.getHttpServer())
      .get(`/api/v1/devices/e2e-dev-1/latest`)
      .expect(200);
    expect(latest.body.deviceId || latest.body.deviceId === 'e2e-dev-1').toBeTruthy();
  });
});
