import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { TelemetryService } from './telemetry.service';

describe('TelemetryService', () => {
  let service: TelemetryService;
  const mockModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    aggregate: jest.fn(),
    save: jest.fn(),
  };
  const mockRedis = { get: jest.fn(), set: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemetryService,
        { provide: getModelToken('Telemetry'), useValue: mockModel },
        { provide: 'REDIS', useValue: mockRedis },
      ],
    }).compile();
    service = module.get<TelemetryService>(TelemetryService);
  });

  it('should dedupe alerts within 60s', async () => {
    mockRedis.get.mockResolvedValueOnce(null).mockResolvedValueOnce('1');
    mockRedis.set.mockResolvedValue(true);
    const dto = {
      deviceId: 'u1',
      siteId: 's1',
      ts: new Date().toISOString(),
      metrics: { temperature: 60, humidity: 10 },
    };
    (service as any).alertWebhook = 'https://example.invalid';
    await service.maybeSendAlert(dto, 'HIGH_TEMPERATURE', 60);
    await service.maybeSendAlert(dto, 'HIGH_TEMPERATURE', 60);
    expect(mockRedis.set).toHaveBeenCalled();
  });
});
