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
| **Site Summary** | `GET /api/v1/sites/:siteId/summary` – aggregations over time range |
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
│   ├── dto/
│   │   └── create-telemetry.dto.ts
│   ├── schemas/
│   │   └── telemetry.schema.ts
│   ├── telemetry.controller.ts
│   ├── telemetry.service.ts
│   └── telemetry.module.ts
├── devices/
│   ├── devices.controller.ts
│   ├── devices.service.ts
│   └── devices.module.ts
├── sites/
│   ├── sites.controller.ts
│   ├── sites.service.ts
│   └── sites.module.ts
├── health/
│   ├── health.controller.ts
│   └── health.module.ts
├── common/
│   ├── guards/
│   │   └── auth.guard.ts
│   └── interceptors/
│       └── logging.interceptor.ts
├── config/
│   └── configuration.ts
├── app.module.ts
└── main.ts
text---

## Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd telemetry-ingestor
npm install
2. Environment Variables
bashcp .env.example .env
Edit .env:
env# MongoDB (Atlas or local)
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/telemetry?retryWrites=true&w=majority

# Redis
REDIS_URL=redis://localhost:6379

# Alert Webhook (use https://webhook.site for testing)
ALERT_WEBHOOK_URL=https://webhook.site/19ac7206-e2ab-4d13-a3f6-d0d881fc8b12

# Optional: Secure ingest endpoint
INGEST_TOKEN=secret123

# Server
PORT=3000
MongoDB Atlas Free Tier: Database telemetry is auto-created on first insert.
Webhook Testing: Get your unique URL from https://webhook.site

Run the App
bash# Development (with auto-reload)
npm run start:dev

Testing

Unit tests: npm run test

E2E tests: npm run test:e2e

AI Assistance

This project used AI (ChatGPT) in the following ways:

Refactored supertest import for E2E tests to fix TypeScript errors.

Resolved ESLint/TypeScript issues (no-unsafe-assignment, unbound-method).

Improved Redis provider typing and factory setup in NestJS.

Enhanced E2E assertions and error handling.

Structured .env setup and documentation for easy configuration.