export class TelemetryResponseDto {
  deviceId: string;
  siteId: string;
  ts: string;
  metrics: { temperature: number; humidity: number };
}
