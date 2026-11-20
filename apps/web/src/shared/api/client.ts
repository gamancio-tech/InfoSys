import { API_PREFIX } from '@infosys/shared';
import createClient from 'openapi-fetch';
import type { paths } from './schema';

const baseUrl = import.meta.env.VITE_API_URL ?? `/${API_PREFIX}`;

/**
 * Cliente HTTP tipado do InfoSys (ADR-0010, docs/06-api.md).
 * Consome `paths` gerado automaticamente por `bun run api:generate`.
 * Inclui `credentials: 'include'` para envio do cookie HttpOnly do Better Auth (ADR-0004, ADR-0005).
 */
export const apiClient = createClient<paths>({
  baseUrl,
  credentials: 'include',
});
