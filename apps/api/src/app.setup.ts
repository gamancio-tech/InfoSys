import { API_PREFIX } from '@infosys/shared';
import type { NestExpressApplication } from '@nestjs/platform-express';

/**
 * Aplica configurações transversais da aplicação HTTP (usado em main.ts e testes E2E).
 */
export function configureApp(app: NestExpressApplication): void {
  // Confia no primeiro proxy reverso (Render em produção / Vite em dev) para IP real e X-Forwarded-Proto
  app.set('trust proxy', 1);

  // Versionamento na URL conforme docs/06-api.md (/v1), mantendo /health e /api/* (Better Auth / OpenAPI) fora do prefixo
  app.setGlobalPrefix(API_PREFIX, {
    exclude: ['health', 'api/*path'],
  });
}

