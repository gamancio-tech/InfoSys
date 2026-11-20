---
name: commit-and-deploy
description: >-
  Padroniza a criação de commits semânticos (com rastreabilidade de IDs e corpo em bullets),
  a validação pré-commit/CI (Gitleaks, Prettier, Oxlint, TypeScript, Jest) e os procedimentos
  de deploy e migrations (Node 24.20.0, Render, Vercel, Supabase, DIRECT_URL) no projeto InfoSys.
  Use esta skill OBRIGATORIAMENTE sempre que for realizar um commit, configurar hooks/CI ou
  preparar/revisar configurações de deploy e produção.
---

# Governança de Commit, CI, Pré-Commit e Deploy · InfoSys

Esta skill define o fluxo oficial de controle de versão, validação contínua e entrega em produção do monorepo **InfoSys**, alinhado com [docs/07-seguranca.md](../../../docs/07-seguranca.md), [docs/08-testes.md](../../../docs/08-testes.md), [docs/09-operacao.md](../../../docs/09-operacao.md) e as ADRs `0002`, `0004`, `0008` e `0010`.

---

## 1. Padrão Oficial de Mensagem de Commit

Todos os commits do repositório seguem **Conventional Commits em português**, com **cabeçalho rastreável** e **corpo estruturado em lista de bullets** (usando múltiplos `-m` no `git commit`).

### 1.1. Formato Obrigatório

```text
<tipo>(<escopo>): <resumo conciso no infinitivo> (<IDs opcionais: RF-*, RN-*, RNF-*, ADR-*>)

- <Verbo no presente> <o que foi criado, configurado ou alterado no item 1>
- <Verbo no presente> <o que foi criado, configurado ou alterado no item 2>
- <Verbo no presente> <atualização documental/testes correspondente e IDs relacionados>
```

**Comando Git padrão:**
```bash
git commit -m "<tipo>(<escopo>): <resumo>" -m "- <Bullet 1>
- <Bullet 2>
- <Bullet 3>"
```

### 1.2. Tipos Semânticos Permitidos

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade de produto ou implementação de requisito (`RF-*`, `RN-*`). |
| `fix` | Correção de bug funcional, erro de cálculo (`Decimal`), fuso horário ou falha de isolamento. |
| `docs` | Criação ou atualização exclusiva de documentação (`docs/*`, `docs/adr/*`, `.agents/*`, `README.md`). |
| `chore` | Setup de projeto, configurações de pacote (`package.json`, `tsconfig`), `.env.example`, `.gitignore`. |
| `ci` | Criação ou ajuste na esteira do GitHub Actions (`.github/workflows/ci.yml`) ou hooks (`.githooks/*`). |
| `test` | Adição ou melhoria exclusiva de testes unitários, de integração/isolamento ou E2E (`RNF-004`, `RNF-011`). |
| `refactor` | Reestruturação interna de código sem alterar comportamento nem contrato de API. |
| `perf` | Melhoria mensurável de desempenho (`RNF-001`, `RNF-002`). |

### 1.3. Escopos Recomendados (`<escopo>`)

- **Monorepo / Infraestrutura:** `api`, `web`, `shared`, `agents`, `ci`, `repo`, `db`
- **Plataforma (`apps/api/src/platform/*`):** `auth`, `tenancy`, `database`, `queue`, `mail`, `storage`, `documents`
- **Domínio (`apps/api/src/modules/*`):** `customers`, `appointments`, `maintenance`, `quotes`, `catalog`, `inventory`, `finance`, `invoices`, `files`, `notifications`

### 1.4. Regras de Estilo e Rastreabilidade da Mensagem

1. **Verbo no infinitivo no cabeçalho** (ex.: `adicionar`, `configurar`, `implementar`, `corrigir`, `padronizar`) e **sem ponto final**.
2. **Verbo na 3ª pessoa do presente nos bullets do corpo** (ex.: `- Cria...`, `- Adiciona...`, `- Configura...`, `- Padroniza...`, `- Atualiza...`, `- Centraliza...`).
3. **Rastreabilidade por ID ([docs/README.md](../../../docs/README.md)):** Sempre que a mudança estiver ligada a requisitos, regras de negócio ou decisões arquiteturais, **inclua os IDs (`RF-*`, `RN-*`, `RNF-*`, `ADR-*`)** entre parênteses no título e/ou nos bullets do corpo. Isso permite auditar entregas com `git log --grep "RF-AGE-004"`.

### 1.5. Exemplos Reais do Repositório

**Exemplo 1 — Documentação e Governança de IA (`docs(agents)`):**
```text
docs(agents): adicionar contexto do projeto, skills de governança documental e padronizar diagrama ER

- Cria documento consolidado de contexto do projeto (.agents/project-context.md) a partir de docs/ e ADRs 0001-0010
- Adiciona skill docs-sync para análise de impacto e atualização contínua da documentação (docs-as-code)
- Adiciona skill infosys-context e regra automática docs-as-code no workspace
- Padroniza modelo conceitual ER em docs/04-dados.md conforme convenções de multi-tenancy e Better Auth (ADR-0005, RN-002)
- Atualiza status da Fase 0 em docs/roadmap.md
```

**Exemplo 2 — Configuração Base de Pacote e Ambiente (`chore(api)`):**
```text
chore(api): configurar base do NestJS, variaveis de ambiente e git do monorepo (ADR-0002, ADR-0010)

- Inicializa apps/api (@infosys/api) com NestJS 12, TypeScript 6, Oxlint, Prettier e Jest em Node >= 24.20.0
- Configura tsconfig, jest, AGENTS.md e README de apps/api alinhados a arquitetura modular (modules/ e platform/)
- Adiciona apps/api/.env.example e sincroniza tabela de variaveis em docs/09-operacao.md (ADR-0004, ADR-0005, ADR-0008, RF-AUT-002)
- Centraliza .gitignore e .gitattributes (eol=lf) na raiz do monorepo
```

**Exemplo 3 — CI e Pré-Commit (`ci(repo)`):**
```text
ci(repo): configurar GitHub Actions, hook de pre-commit com gitleaks e scripts da raiz (RNF-004, RNF-011)

- Cria workflow .github/workflows/ci.yml com jobs security (gitleaks) e api (Node 24.20.0 + Postgres 16)
- Adiciona hook nativo .githooks/pre-commit para bloqueio de .env/chaves e varredura local com gitleaks
- Cria package.json na raiz do monorepo centralizando scripts de build, lint, format, typecheck e test
- Documenta alinhamento entre pre-commit e CI em docs/07-seguranca.md e docs/08-testes.md
```

---

## 2. Checklist Obrigatório Antes de Fazer Commit

Antes de rodar `git add` e `git commit`, execute obrigatoriamente os 4 passos abaixo:

1. **Sincronização Documental (`docs-sync`):**
   - A documentação correspondente (`docs/*`, `.agents/project-context.md`) já foi atualizada? Código e documentação devem subir **no mesmo commit**.
2. **Inspeção da Árvore e Proteção de Segredos:**
   - Rode `git status --short -uall`.
   - Verifique se nenhum arquivo `.env` (exceto `.env.example`), `*.pem`, `*.key` ou dado real de cliente entrou na lista.
3. **Validação de Qualidade Local (quando houver mudança de código em `apps/` ou `packages/`):**
   - A partir da raiz do monorepo, valide as etapas equivalentes ao CI:
     - `bun run format:check` (ou `bun run format` para corrigir quebras `LF` e estilo Prettier)
     - `bun run lint` (Oxlint type-aware: zero warnings e zero errors)
     - `bun run typecheck` (`tsc --noEmit`)
     - `bun run test` (Jest no Node `>= 24.20.0`)
4. **Respeito ao Hook `.githooks/pre-commit`:**
   - **Proibido** usar `git commit --no-verify`. Se o hook falhar, corrija a causa antes de comitar.

---

## 3. Alinhamento entre Pré-Commit Local e CI

Ao manter ou evoluir `.githooks/pre-commit` e `.github/workflows/ci.yml`, preserve a divisão arquitetural definida em [docs/07-seguranca.md](../../../docs/07-seguranca.md) e [docs/08-testes.md](../../../docs/08-testes.md):

| Camada | Arquivo | Tempo Alvo | Responsabilidade |
|---|---|---|---|
| **Pré-commit Local** | [.githooks/pre-commit](../../../.githooks/pre-commit) | `< 1 s` | Bloquear arquivos `.env`/`.env.*`/`.pem`/`.key` (exceto `.env.example`) no stage e rodar `gitleaks git --staged --redact`. **Não** incluir build nem suíte de testes aqui para não gerar atrito local. |
| **CI — Segurança** | [.github/workflows/ci.yml](../../../.github/workflows/ci.yml) (`security`) | `~15 s` | Rodar `gitleaks-action@v2` em todo o histórico (`fetch-depth: 0`) a cada `push` e `pull_request`. |
| **CI — Shared** | [.github/workflows/ci.yml](../../../.github/workflows/ci.yml) (`shared`) | `~30 s` | Rodar `format:check` (Prettier), `build`, `lint` (`Oxlint --type-aware`) e `typecheck` de `@infosys/shared`. |
| **CI — Qualidade & API** | [.github/workflows/ci.yml](../../../.github/workflows/ci.yml) (`api`) | `~1–2 min` | Rodar em **Node.js `24.20.0`** com serviço **PostgreSQL 16**: `bun install --frozen-lockfile` → `build:shared` → `lint` → `typecheck` → `test` (unitários) → `test:e2e` → `build`. |
| **CI — Qualidade & Web** | [.github/workflows/ci.yml](../../../.github/workflows/ci.yml) (`web`) | `~1 min` | Rodar em **Node.js `24.20.0`**: `bun install --frozen-lockfile` → `build:shared` → `lint` (`Oxlint --type-aware`) → `typecheck` → `test` (Vitest) → `build` (Vite + PWA). |

---

## 4. Governança de Deploy e Produção

Sempre que configurar scripts de build, Dockerfile, pipelines de deploy ou migrations ([docs/09-operacao.md](../../../docs/09-operacao.md)), aplique as seguintes regras:

### 4.1. Portões que Bloqueiam Deploy (`Merge / Release Gates`)
- **CI 100% verde:** Nenhum deploy ocorre se `gitleaks`, `lint`, `typecheck`, `test`, `test:e2e` ou `build` falharem.
- **Zero vazamento entre tenants (`RNF-004`):** Todo endpoint novo exige teste automatizado provando que a Organização B recebe `404` ao tentar acessar dados da Organização A. Nenhum teste de isolamento pode ter `.skip`.
- **Cobertura de regras de negócio (`RNF-011`):** 100% nas regras `RN-*`.

### 4.2. Topologia e Ambientes ([ADR-0002](../../../docs/adr/0002-runtime-node-vs-bun.md), [ADR-0004](../../../docs/adr/0004-hospedagem-e-dominios.md))
- **Runtime de Produção da API/Worker:** **Node.js `24.20.0`** (`node dist/main`). Nunca usar Bun como runtime do servidor em produção.
- **Domínio e Cookies:** Web na **Vercel** (`app.seudominio.com`) e API no **Render** (`api.seudominio.com`) sob o mesmo domínio raiz (`.seudominio.com`) para que o cookie do Better Auth (`HttpOnly; Secure; SameSite=Lax`) funcione como first-party no Safari/iOS (PWA).
- **Região:** API (Render) e banco PostgreSQL (Supabase) devem estar na **mesma região** para evitar latência de rede a cada query.

### 4.3. Banco de Dados e Migrations no Deploy ([ADR-0004](../../../docs/adr/0004-hospedagem-e-dominios.md), [ADR-0008](../../../docs/adr/0008-jobs-e-filas-pg-boss.md), [ADR-0010](../../../docs/adr/0010-dados-e-contrato-da-api.md))
- **Separação de URLs de conexão:**
  - `DATABASE_URL`: conexão via **pooler** (modo transação) usada pelas queries HTTP da aplicação.
  - `DIRECT_URL`: conexão **direta** obrigatória para rodar `prisma migrate deploy` e para a fila **`pg-boss`**.
- **Ordem no Deploy:** `prisma migrate deploy` (usando `DIRECT_URL`) roda no *release command* **antes** de iniciar a nova instância da API.
- **Migrations Destrutivas em 2 Etapas:** Nunca remova ou renomeie uma coluna/tabela em um único deploy. Use o padrão **Expandir → Migrar → Contrair** para permitir deploy sem downtime e rollback seguro.

### 4.4. Verificação Pós-Deploy e Rollback ([docs/09-operacao.md](../../../docs/09-operacao.md))
1. Validar resposta `200 OK` no endpoint `/health`.
2. Verificar ausência de novos erros no **Sentry** (garantindo que os eventos contenham `organizationId` e `requestId`, sem dados pessoais nos logs — `RNF-009`).
3. Em caso de falha crítica pós-deploy na API, acionar imediatamente o **rollback para o deploy anterior no Render** conforme o Runbook de [09-operacao.md](../../../docs/09-operacao.md#L57-L66).

