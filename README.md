# Telemetry Ingestor (NestJS + TypeScript)

A **minimal, production-ready IoT Telemetry Ingestor** built with **NestJS** and **TypeScript**.

It accepts real-time telemetry readings from IoT devices, stores them in **MongoDB**, caches the **latest reading per device** in **Redis**, and **triggers alerts via webhook** when thresholds are exceeded.

---

## Features

| Feature | Description |
|--------|-------------|
| **Ingest API** | `POST /api/v1/telemetry` – accepts single or batch readings |
| **Persistence** | Stores all data in MongoDB (with TTL optional) |
| **Caching** | Latest per-device reading cached in Redis |
| **Alerting** | Webhook alerts on `temperature > 50` or `humidity > 90` |
| **Latest Query** | `GET /api/v1/devices/:deviceId/latest` – Redis-first, MongoDB fallback |
| **Site Summary** | `GET /api/v1/sites/:siteId/summary?from=ISO&to=ISO` – aggregation over time range |
| **Health Check** | `GET /health` – MongoDB & Redis status |
| **Security** | Optional Bearer token auth (`INGEST_TOKEN`) |
| **Validation** | Full DTO validation with `class-validator` |
| **Testing** | Unit + E2E tests with Jest & Supertest |

---

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com) (v10+)
- **Language**: TypeScript
- **Database**: [MongoDB](https://www.mongodb.com) (via Mongoose)
- **Cache**: [Redis](https://redis.io)
- **Validation**: `class-validator` + `class-transformer`
- **HTTP Client**: Axios (for webhooks)
- **Testing**: Jest, Supertest
- **Config**: `@nestjs/config` + `.env`

---

## Project Structure

src/
├── telemetry/
│ ├── dto/
│ │ └── create-telemetry.dto.ts
│ ├── schemas/
│ │ └── telemetry.schema.ts
│ ├── telemetry.controller.ts
│ ├── telemetry.service.ts
│ └── telemetry.module.ts
├── health/
│ ├── health.controller.ts
│ └── health.module.ts
├── common/
│ ├── guards/
│ │ └── auth.guard.ts
│ └── interceptors/
│ └── logging.interceptor.ts
├── config/
│ └── configuration.ts
├── app.module.ts
└── main.ts


---

## Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd telemetry-ingestor
npm install

2. Environment Variables
cp .env.example .env


Edit .env with your own values:

# MongoDB (Atlas or local)
MONGO_URI=mongodb+srv://sahannimantha2233_db_user:So7NosIFrw7HdsMf@cluster0.csdakfg.mongodb.net/telemetry?retryWrites=true&w=majority

# Redis (local or hosted)
REDIS_URL=redis://localhost:6379

# Alert Webhook (use https://webhook.site for testing)
ALERT_WEBHOOK_URL=https://webhook.site/19ac7206-e2ab-4d13-a3f6-d0d881fc8b12

# Optional: Secure ingest endpoint
INGEST_TOKEN=secret123

# Server port
PORT=3000


Note: MongoDB Atlas Free Tier will automatically create the telemetry database on first insert.
Webhook Testing: Use your unique URL from webhook.site
.

Run the App
# Development (with auto-reload)
npm run start:dev

Quick Verification
1️⃣ Ingest a telemetry reading
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/telemetry" `
-Method POST `
-Headers @{ "Content-Type" = "application/json"; "Authorization" = "Bearer secret123" } `
-Body '{"deviceId":"dev-002","siteId":"site-A","ts":"2025-09-01T10:00:30.000Z","metrics":{"temperature":51.2,"humidity":55}}'

2️⃣ Get latest reading per device
(Invoke-WebRequest -Uri "http://localhost:3000/api/v1/devices/dev-002/latest" -Method GET).Content | ConvertFrom-Json

3️⃣ Get site summary
$from = "2025-09-01T00:00:00.000Z"
$to = "2025-09-02T00:00:00.000Z"

(Invoke-WebRequest -Uri "http://localhost:3000/api/v1/sites/site-A/summary?from=$from&to=$to" -Method GET).Content | ConvertFrom-Json

Testing
# Unit tests
npm run test

# E2E tests
npm run test:e2e

AI Assistance

This project used AI (ChatGPT) in the following ways:

Refactored supertest import for E2E tests to fix TypeScript errors.

Resolved ESLint/TypeScript issues (no-unsafe-assignment, unbound-method).

Improved Redis provider typing and factory setup in NestJS.

Enhanced E2E assertions and error handling.

Structured .env setup and documentation for easy configuration.