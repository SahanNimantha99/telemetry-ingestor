export default () => ({
  MONGO_URI: process.env.MONGO_URI,
  REDIS_URL: process.env.REDIS_URL,
  ALERT_WEBHOOK_URL: process.env.ALERT_WEBHOOK_URL,
  INGEST_TOKEN: process.env.INGEST_TOKEN,
});
