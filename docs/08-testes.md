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

- **Pré-commit local (`.githooks/pre-commit`, < 1 s):** ativado via `git config core.hooksPath .githooks` (`bun run prepare`). Faz apenas verificações instantâneas de segurança (bloqueio de `.env`/chaves no stage + `gitleaks protect --staged`), sem rodar build ou suíte de testes para não travar o fluxo de commits.
- **CI no GitHub Actions (`.github/workflows/ci.yml`):**
  - **Job `security`:** `gitleaks` em todo `push` e `pull_request`.
  - **Job `api`:** `format:check` (Prettier) → `lint` (Oxlint type-aware) → `typecheck` (`tsc --noEmit`) → unitários (Jest em Node 24.20.0) → integração/E2E (Jest + Postgres 16 em serviço) → `build` (`nest build`).
  - **E2E (Playwright):** em `main` e antes de release (quando `apps/web` estiver ativo).

## Metas

- Cobertura das regras de negócio: 100 %.
- Nenhum teste de isolamento pulado (`skip`).
