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

---

## Setup

### 1. Clone & Install

```bash
git clone <https://github.com/SahanNimantha99/telemetry-ingestor>
cd telemetry-ingestor
npm install
```
---

## 2. Environment Variables

Edit .env with your own values:

```bash
# MongoDB (Atlas)
MONGO_URI=

# Redis (local)
REDIS_URL=

# Alert Webhook (use https://webhook.site for testing)
ALERT_WEBHOOK_URL=

# Optional: Secure ingest endpoint
INGEST_TOKEN=

# Server port
PORT=
```
---

## Run the App

```bash
# Development (with auto-reload)
npm run start:dev

Testing
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```
<div align="center">
<img src="./docs/assets/readme/img01.png" width="10000" height="500">
</div>

<div align="center">
<img src="./docs/assets/readme/img02.png" width="10000" height="500">
</div>
---

---

## Quick Verification

## 1️⃣ Ingest a telemetry reading ( PowerShell)

```bash
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/telemetry" `
-Method POST `
-Headers @{ "Content-Type" = "application/json"; "Authorization" = "Bearer secret123" } `
-Body '{"deviceId":"dev-002","siteId":"site-A","ts":"2025-09-01T10:00:30.000Z","metrics":{"temperature":51.2,"humidity":55}}'
```
<div align="center">
<img src="./docs/assets/readme/img03.png" width="10000" height="500">
</div>

## 2️⃣ Get latest reading per device ( PowerShell)

```bash
(Invoke-WebRequest -Uri "http://localhost:3000/api/v1/devices/dev-002/latest" -Method GET).Content | ConvertFrom-Json
```
<div align="center">
<img src="./docs/assets/readme/img04.png" width="10000" height="500">
</div>
## 3️⃣ Get site summary ( PowerShell)

```bash
$from = "2025-09-01T00:00:00.000Z"
$to = "2025-09-02T00:00:00.000Z"

(Invoke-WebRequest -Uri "http://localhost:3000/api/v1/sites/site-A/summary?from=$from&to=$to" -Method GET).Content | ConvertFrom-Json
```
<div align="center">
<img src="./docs/assets/readme/img05.png" width="10000" height="500">
</div>

---

## AI Assistance

- **Framework**: [NestJS](https://nestjs.com) (v10+)
- **Language**: TypeScript
- **Database**: [MongoDB](https://www.mongodb.com) (via Mongoose)
- **Cache**: [Redis](https://redis.io)
- **Validation**: `class-validator` + `class-transformer`
- **HTTP Client**: Axios (for webhooks)
- **Testing**: Jest, Supertest
- **Config**: `@nestjs/config` + `.env`

---
