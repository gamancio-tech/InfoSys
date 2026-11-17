# 06 · API

**O contrato real é o OpenAPI**, gerado pelo NestJS (`/api/docs`, JSON em `/api/openapi.json`). Este documento só descreve as **convenções**. Não liste rotas aqui.

## Base e versionamento

- Base: `https://api.seudominio.com/v1`
- Versão na URL. Mudança incompatível → `/v2`, mantendo `/v1` por **TODO: período**.

## Autenticação

- Sessão por cookie `HttpOnly; Secure; SameSite=Lax` emitido pelo Better Auth, em domínio `.seudominio.com` (ver [ADR-0004](adr/0004-hospedagem-e-dominios.md)).
- A organização ativa vem da sessão, **nunca** de parâmetro da requisição.
- Proteção CSRF: `Origin` verificado + `SameSite`. <!-- TODO: confirmar mecanismo do Better Auth -->

## Formato de erro

```json
{
  "error": {
    "code": "QUOTE_INVALID_TRANSITION",
    "message": "Não é possível aprovar um orçamento cancelado.",
    "details": [{ "field": "status", "issue": "invalid_transition" }],
    "requestId": "01J..."
  }
}
```

- `code`: estável, em `SCREAMING_SNAKE_CASE`, usado pelo front. `message`: legível, em português.
- HTTP: `400` validação · `401` não autenticado · `403` sem permissão · `404` não encontrado (inclusive de outra organização, para não vazar existência) · `409` conflito · `422` regra de negócio · `429` limite · `5xx` falha nossa.

## Paginação, filtro e ordenação

- Cursor: `?limit=25&cursor=<opaco>` → `{ "data": [...], "nextCursor": "..." | null }`.
- Filtros por campo: `?status=APPROVED&customerId=...`. Ordenação: `?sort=-createdAt`.
- `limit` máximo: 100.

## Tipos comuns

- IDs: UUID. Datas: ISO 8601 em UTC. Dinheiro: **string decimal** (`"1234.50"`), nunca número, para evitar erro de ponto flutuante.

## Idempotência

- `POST` que cria cobrança ou envia algo aceita `Idempotency-Key`.

## Limites

- Rate limit por IP e por organização. <!-- TODO: definir valores -->

## Uploads e downloads

- Arquivos vão para o storage por **URL assinada de curta duração** (upload e download), com caminho `org/{organizationId}/...`.
- Limites: tamanho **TODO: MB**, tipos permitidos **TODO: png, jpg, pdf**.

## Cliente tipado no front

`bun run api:generate` gera o cliente a partir do OpenAPI (ex.: `openapi-typescript` + `openapi-fetch`, ou `orval`). Sem tipos de API escritos à mão no front.
