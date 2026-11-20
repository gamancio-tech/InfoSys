# AGENTS.md · @infosys/api

Regras específicas para agentes de IA atuando no backend (`apps/api`) do **InfoSys**. Para o contexto completo do produto, consulte [../../.agents/project-context.md](../../.agents/project-context.md).

## 1. Stack e Decisões Arquiteturais (ADRs)

Não substitua as tecnologias decididas nas ADRs por pacotes genéricos do ecossistema NestJS:

- **Framework & Runtime:** NestJS 12 sobre **Node.js `24.20.0`** em produção e testes ([ADR-0002](../../docs/adr/0002-runtime-node-vs-bun.md)). Bun é usado apenas como gerenciador de pacotes/scripts.
- **Banco de Dados & ORM:** **PostgreSQL (Supabase) + Prisma ORM** ([ADR-0010](../../docs/adr/0010-dados-e-contrato-da-api.md)). **Não** use `@nestjs/typeorm`, `@nestjs/drizzle`, `@nestjs/sequelize` ou `@nestjs/mongoose`.
- **Multi-Tenancy ([ADR-0003](../../docs/adr/0003-multi-tenancy.md)):** Banco único com coluna `organization_id NOT NULL` em todas as tabelas de domínio, isolado por **Prisma Client Extension** (escopo injetado automaticamente a partir da sessão) + RLS no Postgres (`SET LOCAL app.organization_id`).
- **Autenticação & Organizações ([ADR-0005](../../docs/adr/0005-autenticacao-better-auth.md)):** **Better Auth** com plugin `organization` (papéis: proprietário, administrador, técnico). Sessão por cookie `HttpOnly; Secure; SameSite=Lax`. O `organizationId` vem **sempre da sessão**, nunca de parâmetros da requisição.
- **Validação & Contrato OpenAPI ([ADR-0010](../../docs/adr/0010-dados-e-contrato-da-api.md), [docs/06-api.md](../../docs/06-api.md)):** Schemas **Zod** (`nestjs-zod` / Standard Schema) validam entradas e geram o contrato OpenAPI (`/api/docs`, `/api/openapi.json`).
- **Jobs e Filas Assíncronas ([ADR-0008](../../docs/adr/0008-jobs-e-filas-pg-boss.md)):** **pg-boss** sobre PostgreSQL (conexão `DIRECT_URL`), com jobs estritamente **idempotentes** atrás da interface `QueueService` em `src/platform/queue/`. **Não** use `node-cron`, `@nestjs/schedule` nem BullMQ/Redis no MVP.
- **Geração de Documentos ([ADR-0006](../../docs/adr/0006-geracao-de-documentos.md)):** PDF de orçamento (Fase 1) com `@react-pdf/renderer` ou `pdfmake` rodando em worker (`pg-boss`), salvo em bucket privado do Supabase Storage com URL assinada.
- **Observabilidade ([docs/09-operacao.md](../../docs/09-operacao.md), `RNF-009`):** **Sentry** + logs estruturados JSON contendo `organizationId` e `requestId` (sem dados pessoais nos logs).

## 2. Regras de Camadas e Dependências ([docs/03-arquitetura.md](../../docs/03-arquitetura.md))

```text
src/
  modules/    # Módulos de domínio: customers, appointments, maintenance, quotes,
              # catalog, inventory, finance, invoices, files, notifications
  platform/   # Infraestrutura transversal: auth, tenancy, database, queue, mail, storage, documents
```

1. `modules/*` **nunca** importam arquivos internos de outros módulos; comunicam-se apenas via **serviços exportados** do módulo ou **eventos de domínio**.
2. `platform/*` **não conhece** `modules/*`.
3. **Controllers** apenas validam entrada, chamam um `Service` e formatam a saída. **Toda regra de negócio (`RN-*`) fica no `Service`.**
4. Acesso ao banco de domínio passa exclusivamente pelo cliente Prisma com escopo de organização.
5. Recurso não encontrado **ou pertencente a outra organização** retorna sempre **`404 Not Found`** (nunca `403`, para evitar enumeração de IDs).

## 3. Convenções de Dados e Testes ([docs/04-dados.md](../../docs/04-dados.md), [docs/08-testes.md](../../docs/08-testes.md))

- **Dinheiro (`RN-011`):** `Decimal(14,2)` no banco/Prisma e **string decimal** (`"1234.50"`) no JSON da API. Proibido usar `Float` ou `number`.
- **Datas (`RN-012`):** Persistidas e trafegadas em UTC (`timestamptz` / ISO 8601).
- **Exclusão (`RN-014`):** Soft delete via `archived_at` onde houver histórico.
- **Testes:** Executar sempre via Jest sobre Node (`bun run test` / `bun run test:e2e`). **Proibido usar `bun test` no backend.**
- **Rastreabilidade:** Referenciar os IDs de requisitos (`RF-*`, `RN-*`, `RNF-*`) nos blocos `describe`/`it` dos testes e nas mensagens de commit.
