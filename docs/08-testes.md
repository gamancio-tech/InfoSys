# 08 · Estratégia de testes

**Status:** Rascunho.

## Pirâmide

| Nível | Ferramenta | O que cobre | Banco |
|---|---|---|---|
| Unitário | Jest (API) · Vitest (web) | Regras puras: cálculo de totais, próxima manutenção, transições de estado | — |
| Integração | Jest + Supertest + Postgres real (Docker/Testcontainers) | Módulos, queries, **isolamento entre organizações** | Real |
| E2E | Playwright | 3–4 fluxos: login → cliente → orçamento → PDF; convite de técnico; aviso de manutenção | Real |
| Carga | k6 | RNF-001 em endpoints de lista | Real |

`bun test` **não** é usado no backend (ver [ADR-0002](adr/0002-runtime-node-vs-bun.md)).

## Obrigatórios (bloqueiam merge)

1. **Isolamento:** para cada controller, dois usuários em organizações diferentes; B nunca lê/altera/lista dados de A.
2. **Regras de negócio** com ID no nome do teste (`RF-…`, `RN-…`).
3. **Dinheiro:** totais com `Decimal`, casos de arredondamento.
4. **Datas:** transições de fuso e horário de verão não quebram recorrência (RN-012).

## Convenção de nomes

```ts
describe('RF-MAN-002 · recalcular próxima manutenção', () => {
  it('soma o intervalo à data de conclusão (RN-009)', ...)
})
```

## Dados de teste

- Fábricas (`createOrganization`, `createCustomer`...) em `apps/api/test/factories`.
- Cada teste de integração roda em transação revertida ou schema limpo.

## Pré-commit e CI

Divisão entre validação local rápida e esteira completa no servidor:

- **Banco local para integração:** `docker compose up -d` sobe o PostgreSQL 16 configurado em `docker-compose.yml`.
- **Separação de suítes na API:** unitários (`apps/api/src/**/*.spec.ts`, via `jest.config.ts`) rodam sem banco; integração/E2E (`apps/api/test/**/*.e2e-spec.ts`, via `test/jest-e2e.config.ts`) rodam separados com suporte completo aos aliases do `tsconfig.json`.
- **Pré-commit local (`.githooks/pre-commit`, < 1 s):** ativado automaticamente via `bun install` (`prepare` → `git config core.hooksPath .githooks`). Bloqueia `.env`/`.env.*`/`.pem`/`.key` (exceto `.env.example`) e executa `gitleaks git --staged --redact --verbose`.
- **CI no GitHub Actions (`.github/workflows/ci.yml` — permissões mínimas `read`, cache de Bun, versões fixas via `.node-version` e `packageManager`):**
  - **Job `security`:** `gitleaks` em todo `push` e `pull_request`.
  - **Job `shared`:** `format:check` (Prettier em todo o monorepo) → build, lint (`Oxlint --type-aware`) e typecheck de `@infosys/shared`.
  - **Job `api`:** `lint` (Oxlint type-aware) → `typecheck` (`tsc --noEmit`) → unitários (Jest em Node 24.20.0) → integração/E2E (Jest + Postgres 16 em serviço) → `build` (`nest build`).
  - **Job `web`:** `lint` (Oxlint type-aware React/TS) → `typecheck` (`tsc -b`) → unitários (Vitest + Testing Library) → `build` (`vite build` + PWA).
  - **E2E (Playwright):** em `main` e antes de release.

## Metas

- Cobertura das regras de negócio: 100 %.
- Nenhum teste de isolamento pulado (`skip`).
