import { Request, Response, NextFunction } from 'express';

export const logger = {
  info(msg: string, meta?: unknown) {
    console.log(JSON.stringify({ level: 'info', msg, meta: redact(meta) }));
  },

  error(msg: string, meta?: unknown) {
    console.error(JSON.stringify({ level: 'error', msg, meta: redact(meta) }));
  },

  middleware(req: Request, res: Response, next: NextFunction) {
    // simple structured access log without bodies (no secrets)
    const start = Date.now();
    res.on('finish', () => {
      const meta = {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
      };
      console.log(JSON.stringify({ level: 'info', msg: 'http_request', meta }));
    });
    next();
  },
};

// redact known sensitive keys if present in a meta object
function redact(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  const copy: Record<string, unknown> = {};
  for (const k of Object.keys(obj as Record<string, unknown>)) {
    if (['authorization', 'password', 'token', 'ingest_token'].includes(k.toLowerCase())) {
      copy[k] = 'REDACTED';
    } else {
      // use type assertion here safely
      copy[k] = (obj as Record<string, unknown>)[k];
    }
  }
  return copy;
}
