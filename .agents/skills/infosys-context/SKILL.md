---
name: infosys-context
description: >-
  Carrega o contexto completo, arquitetura, regras de negócio, vocabulário de domínio,
  multi-tenancy e decisões arquiteturais (ADRs) do projeto InfoSys. Use esta skill ao
  iniciar tarefas de planejamento, modelagem de banco de dados, implementação de código
  (backend NestJS ou frontend React/PWA), criação de testes ou revisão arquitetural.
---

# Contexto e Guardrails Arquiteturais · InfoSys

Esta skill orienta o trabalho assistido por IA no monorepo **InfoSys**, garantindo aderência estrita à documentação oficial e às ADRs (`0001` a `0010`).

## 1. Fonte Primária de Contexto

Antes de propor arquitetura, criar tabelas, escrever endpoints ou alterar regras de negócio, leia o documento consolidado de contexto do projeto:

- **[Contexto Consolidado do Projeto](../../project-context.md)** (`.agents/project-context.md`)

Se a tarefa exigir detalhes específicos de uma camada, consulte diretamente o documento correspondente em `docs/`:
- Escopo e Fases: [01-visao-e-escopo.md](../../../docs/01-visao-e-escopo.md) e [roadmap.md](../../../docs/roadmap.md)
- Requisitos (`RF-*`, `RNF-*`, `RN-*`): [02-requisitos.md](../../../docs/02-requisitos.md)
- Arquitetura C4 e Camadas: [03-arquitetura.md](../../../docs/03-arquitetura.md)
- Modelo ER e Convenções de Banco: [04-dados.md](../../../docs/04-dados.md)
- Sequências e Máquinas de Estado: [05-fluxos.md](../../../docs/05-fluxos.md)
- Convenções HTTP e OpenAPI: [06-api.md](../../../docs/06-api.md)
- Segurança, RBAC e LGPD: [07-seguranca.md](../../../docs/07-seguranca.md)
- Pirâmide de Testes e CI: [08-testes.md](../../../docs/08-testes.md)
- Ambientes, Variáveis e Operação: [09-operacao.md](../../../docs/09-operacao.md)
- Vocabulário Oficial (PT ↔ EN): [glossario.md](../../../docs/glossario.md)
- Decisões Arquiteturais: [docs/adr/README.md](../../../docs/adr/README.md)

---

## 2. Guardrails Inegociáveis durante a Codificação

1. **Multi-Tenancy e Isolamento (`ADR-0003`, `RN-002`, `RNF-004`):**
   - Toda tabela de domínio tem `organization_id NOT NULL` + índice.
   - O `organizationId` ativo vem **exclusivamente da sessão autenticada (Better Auth)**, nunca de parâmetros da requisição (`body`, `query`, `params` ou headers customizados).
   - Os módulos de domínio usam o **cliente Prisma com escopo** (Prisma Client Extension); nunca filtram `organization_id` manualmente em cada query.
   - Recurso pertencente a outra organização retorna **`404 Not Found`** (nunca `403`).

2. **Fronteiras do Monólito Modular (`docs/03-arquitetura.md`):**
   - `apps/api/src/modules/*` não importam arquivos internos de outros módulos; comunicam-se apenas via serviços exportados ou eventos de domínio.
   - `apps/api/src/platform/*` não importa nada de `modules/*`.
   - Controllers apenas validam entrada (`nestjs-zod`), chamam o `Service` e retornam. Toda regra de negócio (`RN-*`) vive no `Service`.
   - Serviços externos (Resend, Supabase Storage, `pg-boss`, geração de PDF, gateway de pagamento) ficam isolados atrás de interfaces em `platform/*`.

3. **Tipagem, Dinheiro e Datas (`docs/04-dados.md`, `docs/06-api.md`, `ADR-0010`):**
   - **Dinheiro (`RN-011`):** `Decimal(14,2)` no banco/Prisma e **string decimal** (`"1234.50"`) no JSON da API. Jamais usar `Float` ou `number`.
   - **Datas (`RN-012`):** Persistidas em UTC (`timestamptz`) e trafegadas em ISO 8601 UTC; convertidas na UI para o fuso da organização.
   - **Contrato de API:** Schemas Zod em `nestjs-zod` geram o OpenAPI, que gera o cliente tipado do frontend (`bun run api:generate`). Jamais escrever interfaces de resposta da API manualmente em `apps/web`.

4. **Processamento Assíncrono e Runtime (`ADR-0002`, `ADR-0006`, `ADR-0008`):**
   - Runtime de produção é **Node.js `24.20.0`**. Testes de backend rodam com **Jest** (proibido `bun test` no backend).
   - Geração de PDF, envio de e-mails e varredura de manutenções rodam em worker via **pg-boss** com chave de idempotência obrigatória.

5. **Rastreabilidade e Escopo (`ADR-0007`, `docs/02-requisitos.md`):**
   - Rejeitar ou alertar imediatamente caso uma implementação tente introduzir itens fora do escopo do MVP (NF-e, scraping de fornecedores, escrita offline no PWA, WhatsApp automático, Puppeteer/LibreOffice na API).
   - Referenciar os IDs de requisitos (`RF-*`, `RNF-*`, `RN-*`) nos nomes dos testes (`describe`/`it`) e mensagens de commit.
   - Ao finalizar qualquer tarefa, executar a skill **`docs-sync`** para verificar e aplicar atualizações na documentação.

