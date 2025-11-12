// Very small helper - using Redis for per-device rate-limit and alert dedupe
export const makeIngestKey = (deviceId: string) => `ingest_rl:${deviceId}`;
export const makeAlertDedupeKey = (deviceId: string, reason: string) =>
  `alert_dedupe:${deviceId}:${reason}`;
export const latestKey = (deviceId: string) => `latest:${deviceId}`;
