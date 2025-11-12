import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class IngestTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    const token = process.env.INGEST_TOKEN || null;
    if (!token) {
      // no token configured -> allow (optional)
      return true;
    }
    if (!auth || typeof auth !== 'string') throw new UnauthorizedException('Missing authorization');
    const m = auth.match(/^Bearer (.+)$/);
    if (!m) throw new UnauthorizedException('Malformed authorization header');
    const provided = m[1];
    if (provided !== token) throw new UnauthorizedException('Invalid token');
    return true;
  }
}
