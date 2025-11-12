import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryService } from './telemetry.service';
import { getModelToken } from '@nestjs/mongoose';

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
    mockRedis.get.mockResolvedValueOnce(null).mockResolvedValueOnce('1'); // first call no dedupe, second call dedup
    mockRedis.set.mockResolvedValue(true);
    const dto = {
      deviceId: 'u1',
      siteId: 's1',
      ts: new Date().toISOString(),
      metrics: { temperature: 60, humidity: 10 },
    };
    // We stub axios through changing service.alertWebhook to an invalid one to avoid real network calls
    (service as any).alertWebhook = 'https://example.invalid';
    // call maybeSendAlert twice
    await service.maybeSendAlert(dto, 'HIGH_TEMPERATURE', 60);
    await service.maybeSendAlert(dto, 'HIGH_TEMPERATURE', 60);
    expect(mockRedis.set).toHaveBeenCalled(); // set dedupe
  });
});
