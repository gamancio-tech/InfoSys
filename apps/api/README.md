# @infosys/api

> Backend do **InfoSys** — Monólito modular em **NestJS + TypeScript** para gestão operacional de prestadores de serviço técnico em campo (clientes, agenda, catálogo, orçamentos em PDF e planos de manutenção recorrente).

---

## Arquitetura e Princípios

A API segue o modelo de **monólito modular** definido em [docs/03-arquitetura.md](../../docs/03-arquitetura.md):

```text
apps/api/
  src/
    modules/            # Módulos de domínio isolados:
                        # customers, appointments, maintenance, quotes, catalog,
                        # inventory, finance, invoices, files, notifications
    platform/           # Infraestrutura transversal:
                        # auth, tenancy, database, queue, mail, storage, documents
    main.ts
  prisma/               # schema.prisma + migrations (PostgreSQL)
  test/                 # Testes de integração, isolamento multi-tenant e factories
```

### Regras de Camadas
1. **Isolamento de módulos:** `modules/*` não importam arquivos internos uns dos outros diretamente; comunicam-se apenas via **serviços exportados** ou **eventos de domínio**.
2. **Plataforma unidirecional:** `platform/*` não conhece `modules/*`.
3. **Separação Controller / Service:** Controllers apenas validam entrada (schemas Zod), chamam o Service e formatam a saída HTTP. **Toda regra de negócio (`RN-*`) fica no Service.**
4. **Multi-tenancy por plataforma ([ADR-0003](../../docs/adr/0003-multi-tenancy.md)):** Acesso a dados de domínio passa obrigatoriamente pelo cliente Prisma com escopo de `organization_id` extraído da sessão ([ADR-0005](../../docs/adr/0005-autenticacao-better-auth.md)).
5. **Provedores externos encapsulados:** E-mail, storage, fila (`pg-boss`) e geração de documentos ficam atrás de interfaces em `platform/*`.

---

## Pré-requisitos e Runtime

- **Node.js:** `>= 24.20.0` em execução e testes ([ADR-0002](../../docs/adr/0002-runtime-node-vs-bun.md))
- **Gerenciador de pacotes:** `bun` (ou `npm`/`pnpm`)
- **Banco de dados:** PostgreSQL (local via Docker ou Supabase)

---

## Como Rodar Localmente

```bash
# Instalar dependências
bun install

# Iniciar em modo de desenvolvimento (watch)
bun run dev
# ou: bun run start:dev

# Compilar para produção
bun run build

# Executar build de produção (Node.js)
bun run start:prod
```

Por padrão, a API responde em `http://localhost:3000`.

---

## Qualidade, Lint e Testes

> **Nota ([ADR-0002](../../docs/adr/0002-runtime-node-vs-bun.md) / [docs/08-testes.md](../../docs/08-testes.md)):** Os testes do backend rodam sobre **Node.js + Jest** (`--experimental-vm-modules`). Não utilize `bun test` diretamente no backend.

```bash
# Análise estática (Oxlint type-aware)
bun run lint
bun run lint:fix

# Verificação de tipos TypeScript
bun run typecheck

# Formatação (Prettier)
bun run format
bun run format:check

# Testes unitários
bun run test
bun run test:watch
bun run test:cov

# Testes de integração / E2E da API
bun run test:e2e
```

### Convenção de Rastreabilidade nos Testes
Todo teste de requisito funcional ou regra de negócio deve referenciar seu ID oficial ([docs/02-requisitos.md](../../docs/02-requisitos.md)):

```ts
describe('RF-AGE-004 · conflito de horário', () => {
  it('avisa quando o técnico já tem atendimento no intervalo sem bloquear (RN-006)', () => {
    // ...
  });
});
```

---

## Variáveis de Ambiente

Copie `.env.example` para `.env` (nunca versione valores reais). A tabela completa de variáveis (`DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `WEB_ORIGIN`, etc.) está documentada em [docs/09-operacao.md](../../docs/09-operacao.md).

---

## Documentação Relacionada

- [Índice da Documentação](../../docs/README.md)
- [02 · Requisitos e Regras de Negócio](../../docs/02-requisitos.md)
- [03 · Arquitetura](../../docs/03-arquitetura.md)
- [04 · Modelo de Dados e Multi-tenancy](../../docs/04-dados.md)
- [06 · Convenções da API](../../docs/06-api.md)
- [07 · Segurança e LGPD](../../docs/07-seguranca.md)
- [08 · Estratégia de Testes](../../docs/08-testes.md)
- [09 · Operação e Deploy](../../docs/09-operacao.md)
- [ADRs (Architecture Decision Records)](../../docs/adr/README.md)
