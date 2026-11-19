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

## CI

Lint → typecheck → unitários → integração (Postgres em serviço) → gitleaks → build. E2E em `main` e antes de release.

## Metas

- Cobertura das regras de negócio: 100 %.
- Nenhum teste de isolamento pulado (`skip`).
