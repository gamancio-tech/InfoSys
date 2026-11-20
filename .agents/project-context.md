# Contexto do Projeto · InfoSys

> Documento de referência consolidado a partir de toda a documentação oficial (`docs/01` a `09`, `glossario.md`, `licoes-do-prototipo.md`, `roadmap.md`, `README.md`, `SECURITY.md`) e dos Architecture Decision Records (`docs/adr/0001` a `0010`).
> **Propósito:** Fornecer contexto completo, restrições arquiteturais, vocabulário de domínio e estado atual das decisões para o desenvolvimento assistido por IA.

---

## 1. Visão Geral, Problema e Proposta de Valor

- **O que é:** **InfoSys** é um SaaS B2B de gestão operacional para prestadores de serviço técnico em campo (instalação, manutenção, assistência técnica).
- **Público-alvo:** Pequenas empresas e autônomos com equipes de 1 a ~10 técnicos. Cada organização possui logins individuais com papéis distintos (**proprietário**, **administrador** e **técnico**).
- **Cliente-âncora:** **Infotell** (empresa de segurança eletrônica), que originou o protótipo v0 (~23 mil linhas) e validará o MVP em operação diária real (meta: MVP em uso diário até `30/11/2026`).
- **Problema que resolve:** Substituir o controle fragmentado em planilhas, agendas de papel e WhatsApp, evitando perda de histórico técnico de clientes, esquecimento de revisões periódicas e retrabalho na emissão de orçamentos.
- **4 Pilares da Proposta de Valor:**
  1. **Histórico completo por cliente:** linha do tempo unificando atendimentos, orçamentos, anotações técnicas e equipamentos instalados.
  2. **Aviso de manutenção recorrente (Diferencial Competitivo):** cálculo automático do próximo vencimento após conclusão de serviço e alertas proativos ao prestador, gerando receita recorrente.
  3. **Orçamento profissional em minutos:** geração de PDF com identidade visual da organização, reaproveitando catálogo, itens avulsos e dados do cliente.
  4. **Uso em campo:** aplicação web mobile-first (utilizável em telas de `360px`), instalável como **PWA** com cache de leitura para consulta sem sinal.

### Restrições Operacionais e de Negócio
- **Capacidade:** Time de 1 pessoa (desenvolvedor solo), ~8 horas/semana disponíveis → exige simplicidade radical, zero over-engineering e proteção rigorosa contra *scope creep*.
- **Orçamento de infraestrutura:** Meta enxuta (~R$ 30,00/mês na fase inicial), porém **sem uso de planos gratuitos que hibernem ou proíbam uso comercial em produção** ([ADR-0004](../docs/adr/0004-hospedagem-e-dominios.md)).
- **Modelo de repositório ([ADR-0001](../docs/adr/0001-licenca-e-modelo-de-negocio.md)):** Repositório público para fins de portfólio, mas **source-available** (código apenas para consulta; uso, hospedagem comercial por terceiros, redistribuição e self-hosting não são permitidos; não aceita contribuições externas).

---

## 2. Escopo por Fases e Fronteiras (O Que Está Dentro e Fora)

| Fase | Escopo Principal | Referência |
|---|---|---|
| **Fase 0 · Fundações** | ADRs 0001–0010, PoC de runtime/integrações, governança de documentação com skills de IA, setup do monorepo + CI + lint + testes + `gitleaks`, Better Auth + organizations + teste de isolamento por tenant, deploy "hello world" em produção. | [roadmap.md](../docs/roadmap.md) |
| **Fase 1 · MVP Vendável** | Autenticação e organizações (`AUT`) · Clientes com múltiplos endereços, anotações e equipamentos (`CLI`) · Agenda mobile-first com tipos configuráveis e aviso de conflito sem bloqueio (`AGE`) · Catálogo de produtos/serviços e itens avulsos (`CAT`) · Orçamentos com numeração sequencial por org/ano, snapshot e geração de PDF no modelo do sistema (`ORC`) · Conversão orçamento aprovado → agendamento com materiais · Planos de manutenção recorrente e avisos por e-mail/push ao prestador (`MAN`) · Histórico/linha do tempo do cliente · Anotações gerais e anexos (`NOT`) · PWA instalável com leitura em cache (`PLT`) · Migração dos dados reais da Infotell. | [01-visao-e-escopo.md](../docs/01-visao-e-escopo.md), [02-requisitos.md](../docs/02-requisitos.md) |
| **Fase 2 · Expansão Operacional** | 2FA opcional (`RF-AUT-008`) · Aviso visual de pendência financeira (`RF-CLI-006`) · Nota de serviço e checklist instalado (`RF-AGE-007/009`) · Importação CSV/Excel e histórico de preços no catálogo (`RF-CAT-005/006`) · Controle de Estoque sem bloquear vendas (`EST`) · Financeiro, Despesas, Dashboard e exportação CSV/Excel (`FIN`) · Faturas e cobrança Pix/boleto via gateway com webhook (`FAT`) · Planos, trial e cobrança do SaaS + exportação completa LGPD (`RF-PLT-003/004`). | [02-requisitos.md](../docs/02-requisitos.md), [roadmap.md](../docs/roadmap.md) |
| **Fase 3 · Automação Avançada** | Aviso de manutenção ao cliente final por e-mail (`RF-MAN-006`) · Integração com fornecedor via API oficial (`RF-CAT-007`) · Modelo Word com placeholders → PDF via Gotenberg (`RF-ORC-008`) · Importação de modelo PDF arbitrário (`RF-ORC-009`) · Importação e preenchimento de planilhas Excel do usuário (`RF-FIN-007/008`) · IA para modelos de PDF (somente se houver demanda). | [02-requisitos.md](../docs/02-requisitos.md), [ADR-0006](../docs/adr/0006-geracao-de-documentos.md) |

### 🚫 Proibido Implementar no MVP ([ADR-0007](../docs/adr/0007-itens-fora-do-mvp.md))
1. **Emissão de NF-e / NFS-e** (alta complexidade fiscal municipal).
2. **Scraping de sites de fornecedores ou bypass de anti-bot** (risco jurídico e fragilidade comprovada no protótipo; manter apenas a interface `ISupplierClient` para futura API oficial na Fase 3).
3. **Escrita offline com sincronização no PWA** ([ADR-0009](../docs/adr/0009-estrategia-offline.md): o MVP suporta apenas **leitura em cache** com aviso claro de "sem conexão: somente leitura").
4. **Envio automático de WhatsApp via API ao cliente final** (no MVP, usar apenas links profundos `wa.me` / compartilhamento manual).
5. **Modelos Word/Excel customizados ou IA (Gemini) para extração de PDF** (adiados para a Fase 3).
6. **Self-hosting, ERP completo (RH, contabilidade, compras) ou app nativo iOS/Android.**

---

## 3. Resumo das Decisões Arquiteturais (ADRs 0001–0010)

| ADR | Tema | Status no Arquivo | Decisão Consolidada |
|---|---|---|---|
| [ADR-0001](../docs/adr/0001-licenca-e-modelo-de-negocio.md) | Licença e modelo de negócio | ⏳ Pendente | SaaS comercial; repositório público para portfólio (*source-available*, não open source OSI). Falta escolher licença final com validação jurídica. |
| [ADR-0002](../docs/adr/0002-runtime-node-vs-bun.md) | Runtime: Node vs Bun | ✅ Decidida | **Node.js `24.20.0` em produção** (previsibilidade com NestJS, Prisma, PDF/XLSX e `pg-boss`). Bun opcional apenas como gerenciador de pacotes/scripts. **Proibido usar `bun test` no backend.** |
| [ADR-0003](../docs/adr/0003-multi-tenancy.md) | Multi-tenancy | ⏳ Pendente* | **Banco único com coluna `organization_id`** e defesa em 3 camadas: (1) Prisma Client Extension injetando `organization_id` da sessão, (2) RLS no Postgres via `SET LOCAL app.organization_id`, (3) Testes de isolamento por endpoint no CI. *(Nota: decisão escrita; pendente validar RLS + pooler Supabase na PoC).* |
| [ADR-0004](../docs/adr/0004-hospedagem-e-dominios.md) | Hospedagem, domínios e região | ✅ Decidida | Web na **Vercel** (`app.seudominio.com`), API/Worker no **Render** (`api.seudominio.com`), Banco/Storage no **Supabase**. Mesmo domínio raiz (`.seudominio.com`) para cookies first-party no Safari/iOS. API e banco na mesma região. Conexão via **pooler** para app e **direta** (`DIRECT_URL`) para migrations e `pg-boss`. |
| [ADR-0005](../docs/adr/0005-autenticacao-better-auth.md) | Autenticação | ✅ Decidida | **Better Auth** com plugin **organization** (organizações, membros, convites, papéis: proprietário, administrador, técnico). Descarta a autenticação manual do protótipo. |
| [ADR-0006](../docs/adr/0006-geracao-de-documentos.md) | Geração de documentos | ✅ Decidida | **Fase 1:** PDF de orçamento com `@react-pdf/renderer` ou `pdfmake` rodando em worker (sem Chromium/Puppeteer). **Fase 2:** `papaparse`/`fast-csv` e `ExcelJS`. **Fase 3:** `docx-templates` + **Gotenberg** em container separado. Arquivos salvos em bucket privado com URL assinada. |
| [ADR-0007](../docs/adr/0007-itens-fora-do-mvp.md) | Itens fora do MVP | ✅ Decidida | Formaliza os cortes de escopo (NF-e, scraping, IA em PDF, Word/Excel do usuário, financeiro/estoque/faturas na Fase 1, escrita offline, WhatsApp automático). |
| [ADR-0008](../docs/adr/0008-jobs-e-filas-pg-boss.md) | Jobs e filas | ✅ Decidida | **pg-boss** sobre o próprio PostgreSQL (evita Redis no MVP), exigindo `DIRECT_URL` (ou modo sessão) e **jobs estritamente idempotentes** atrás da interface `QueueService`. |
| [ADR-0009](../docs/adr/0009-estrategia-offline.md) | Estratégia offline do PWA | ⏳ Pendente* | **Opção 1 no MVP:** PWA instalável + **leitura em cache** (`vite-plugin-pwa`, *stale-while-revalidate* para agenda do dia e clientes recentes) + banner "sem conexão: somente leitura". *(Nota: decisão escrita; status do cabeçalho ainda marca Pendente).* |
| [ADR-0010](../docs/adr/0010-dados-e-contrato-da-api.md) | Banco, ORM e contrato da API | ✅ Decidida | **PostgreSQL (Supabase)** + **Prisma ORM**. Contrato da API guiado por **schemas Zod (`nestjs-zod`) → OpenAPI → cliente tipado gerado no front** (`bun run api:generate`). Monorepo com `packages/shared`. |

---

## 4. Arquitetura, Monorepo e Leis de Camadas

### Stack Tecnológica Oficial
- **Frontend (`apps/web`):** React + TypeScript, Vite, Tailwind CSS, `vite-plugin-pwa`, cliente HTTP gerado via OpenAPI (`openapi-typescript` + `openapi-fetch`).
- **Backend (`apps/api`):** NestJS + TypeScript sobre Node.js `24.20.0`, `nestjs-zod`, Better Auth, Prisma ORM, `pg-boss`.
- **Compartilhado (`packages/shared`):** Schemas Zod, enums e tipos comuns entre web e api.
- **Persistência e Serviços:** PostgreSQL + Supabase Storage (buckets privados), Resend + React Email (e-mails transacionais), Sentry (erros e traces).

### Estrutura do Monorepo ([03-arquitetura.md](../docs/03-arquitetura.md))
Gerenciado com **Bun workspaces** (`package.json` + `bun.lock` único na raiz, `.node-version` `24.20.0`, TypeScript 6 e ferramentas de qualidade compartilhadas):
```text
.agents/                  # Contexto do projeto, rules (docs-as-code, commit-ci-deploy) e skills (infosys-context, docs-sync, commit-and-deploy)
.github/workflows/        # CI no GitHub Actions (ci.yml: jobs security, shared, api, web)
.githooks/                # Hook nativo de pre-commit (bloqueio de .env/chaves + gitleaks git --staged)
.node-version             # Pin da versão do Node.js (24.20.0)
docker-compose.yml        # PostgreSQL 16 local para desenvolvimento e testes
apps/
  api/                    # @infosys/api · NestJS (Monólito Modular, prefixo global /v1)
    src/
      modules/            # Domínio: customers, appointments, maintenance, quotes, catalog,
                          #          inventory, finance, invoices, files, notifications
      platform/           # Infra transversal: auth, tenancy, database, queue, mail, storage, documents
      app.setup.ts        # Configuração compartilhada entre main.ts e testes E2E
      main.ts
    prisma/               # schema.prisma + migrations
    test/                 # Testes de integração/E2E (jest-e2e.config.ts) + factories
  web/                    # @infosys/web · React + Vite + Tailwind v4 + PWA
    src/
      features/           # Espelha os módulos de domínio da API
      shared/             # Componentes de UI, hooks (useOnlineStatus), api-client gerado (openapi-fetch)
      app/                # Rotas, providers, configuração do PWA
packages/
  shared/                 # @infosys/shared · Enums, constantes e schemas Zod comuns
docs/                     # Documentação docs-as-code + ADRs
```

### As 5 Leis Arquiteturais (Invioláveis)
1. **Isolamento entre módulos de domínio:** `modules/*` **nunca** importam arquivos internos uns dos outros diretamente; comunicam-se exclusivamente por **serviços exportados** pelo módulo ou por **eventos de domínio**.
2. **Unidirecionalidade da plataforma:** `platform/*` fornece infraestrutura transversal e **não conhece** `modules/*`.
3. **Responsabilidade de camadas dentro do módulo:**
   - `*.controller.ts`: Apenas valida entrada (DTOs Zod), chama o Service e devolve a resposta HTTP.
   - `*.service.ts`: Contém **toda** a regra de negócio (`RN-*`).
   - `*.repository.ts`: Opcional — criar **somente** quando a query Prisma for complexa.
4. **Acesso ao banco blindado por tenant:** Nenhum módulo acessa o Prisma Client global diretamente para dados de domínio; todo acesso passa pelo **cliente Prisma com escopo de organização** ([ADR-0003](../docs/adr/0003-multi-tenancy.md)). Consultas globais (ex.: worker varrendo planos de manutenção) exigem cliente explícito e nomeado com revisão obrigatória.
5. **Desacoplamento de provedores externos:** Nenhum módulo de domínio chama SDKs de terceiros diretamente (Resend, Supabase Storage, pg-boss, geração de PDF, gateway de pagamento); tudo deve ser consumido por meio de interfaces em `platform/*` (ex.: `EmailService`, `QueueService`).

### Jobs Assíncronos Mapeados (`pg-boss`)
| Job | Gatilho | Fila | Chave de Idempotência |
|---|---|---|---|
| `maintenance.scan` | Cron diário (por fuso da organização) | `maintenance` | `plan_id + ciclo (cycle_due_on)` |
| `email.send` | Evento de domínio | `email` | `message_key` única |
| `quote.render-pdf` | Solicitação do usuário | `documents` | `quote_id + revisão` |

---

## 5. Modelagem de Dados, Contrato de API e Regras de Negócio

### Convenções Obrigatórias de Banco de Dados ([04-dados.md](../docs/04-dados.md))
- **Chave primária:** `uuid` (preferencialmente UUIDv7) para impedir enumeração entre organizações.
- **Isolamento Multi-tenant (`RN-002`):** Toda tabela de domínio possui `organization_id NOT NULL` + índice composto nas consultas frequentes.
- **Valores Monetários (`RN-011`):** `Decimal(14,2)` no Postgres/Prisma e **string decimal** (`"1234.50"`) no JSON da API. **Proibido usar `Float` ou `number` para dinheiro.** Moeda: `BRL`.
- **Datas e Horas (`RN-012`):** Armazenadas em UTC (`timestamptz` no banco e ISO 8601 UTC na API); exibidas no fuso horário configurado na organização.
- **Exclusão Lógica (`RN-014`):** Uso de `archived_at` (*soft delete*) em entidades com histórico (exclusão física apenas por solicitação formal LGPD).
- **Auditoria:** `created_at`, `updated_at`, `created_by`.
- **Nomenclatura física:** Tabelas e colunas sempre em inglês e `snake_case` (mapeadas no Prisma).

### Convenções do Contrato de API ([06-api.md](../docs/06-api.md))
- **Fonte única de verdade:** Schemas Zod → OpenAPI (`/api/docs`, `/api/openapi.json`) → Cliente frontend gerado via `bun run api:generate`. **Proibido criar tipos de payload HTTP manualmente no frontend.**
- **Versionamento:** Prefixo `/v1`.
- **Identificação do Tenant:** A organização ativa vem **exclusivamente do cookie de sessão** (`HttpOnly; Secure; SameSite=Lax` em `.seudominio.com`), **nunca** de parâmetros de rota, query ou body.
- **Segurança contra enumeração (IDOR):** Acesso a recurso pertencente a outra organização deve retornar **`404 Not Found`** (e não `403 Forbidden`).
- **Formato de Erro Padronizado:**
  `{ "error": { "code": "SCREAMING_SNAKE_CASE", "message": "Mensagem em português.", "details": [...], "requestId": "..." } }`
- **Códigos HTTP:** `400` validação · `401` não autenticado · `403` papel sem permissão · `404` não encontrado / outra org · `409` conflito · `422` violação de regra de negócio · `429` rate limit · `5xx` erro interno.
- **Paginação:** Baseada em cursor (`?limit=25&cursor=<opaco>`, máximo `100`), retornando `{ data, nextCursor }`.
- **Uploads/Downloads:** Sempre via **URL assinada de curta duração** no Supabase Storage, sob o prefixo `org/{organizationId}/...`.

### Regras de Negócio Nucleares ([02-requisitos.md](../docs/02-requisitos.md))
- **`RN-001` (RBAC):** Proprietário e administrador acessam tudo (incluindo financeiro e configurações). Técnico acessa clientes, agenda própria e orçamentos, mas **não** vê financeiro nem edita preços de custo.
- **`RN-002` (Isolamento):** Todo dado pertence a exatamente uma organização; nenhuma consulta cruza organizações.
- **`RN-003` (Variação de Preço):** Preço de fornecedor com variação > 25% exige revisão humana (Fase 3).
- **`RN-004` e `RN-005` (Não-bloqueio operacional):** Pendência financeira do cliente exibe aviso visual, mas **não bloqueia** agendamento (`RN-004`). Falta de estoque **não bloqueia** orçamento nem agendamento (`RN-005`).
- **`RN-006` (Conflito de Agenda):** Um técnico pode ter mais de um atendimento no mesmo horário; o sistema detecta o conflito e **avisa sem bloquear** (`RF-AGE-004`).
- **`RN-007` e `RN-008` (Orçamentos):** Orçamento aprovado converte-se em agendamento copiando seus itens como materiais previstos (`RN-007`). Orçamento emitido guarda snapshot do cliente/preços (`RF-ORC-006`) e é imutável nos valores; mudanças geram nova revisão (`RN-008`).
- **`RN-009` e `RN-010` (Manutenção Recorrente):** `próxima manutenção = data de conclusão do último atendimento vinculado + periodicidade do plano` (`RN-009`). O aviso é gerado quando `next_due_on − lead_days ≤ hoje` e ainda não existe `maintenance_reminder` para aquele ciclo (`RN-010`).
- **`RN-013` (Numeração de Orçamento):** Única e sequencial por `organization_id` + ano (ex.: `ORC-2026-0001`), sem lacunas por cancelamento.

---

## 6. Vocabulário Oficial do Domínio ([glossario.md](../docs/glossario.md))

Em código, banco de dados e rotas, utilizar sempre o termo em inglês correspondente:

| Termo de Domínio (PT-BR) | Identificador em Código (EN) | Observação |
|---|---|---|
| Organização (Tenant) | `organization` | Empresa cliente do SaaS (gerenciada via Better Auth) |
| Usuário / Membro / Papel | `user` / `member` / `role` | Vínculo usuário ↔ organização (`owner`, `admin`, `technician`) |
| Cliente | `customer` | Pessoa ou empresa atendida pela organização (não confundir com `user`) |
| Endereço do cliente | `customer_address` | Relação 1:N com `customer` |
| Anotação | `note` | Texto livre anexado a cliente (`customer_id` opcional) ou geral |
| Equipamento | `equipment` | Item físico instalado no cliente (modelo, série, data, endereço) |
| Produto do catálogo | `product` | Item comercializado/usado em serviços (não confundir com `equipment`) |
| Serviço do catálogo | `service_item` | Serviço tabelado com preço de referência |
| Tipo de atendimento | `service_type` | Categoria configurável por organização (ex.: Instalação, Manutenção) |
| Atendimento / Agendamento | `appointment` | Compromisso na agenda (`starts_at`, `ends_at`, técnico, status) |
| Orçamento / Modelo | `quote` / `quote_template` | Proposta comercial numerada e seu layout de PDF |
| Plano / Aviso de manutenção | `maintenance_plan` / `maintenance_reminder` | Regra de recorrência e registro de notificação por ciclo |
| Fatura / Lançamento | `invoice` / `transaction` | Cobrança emitida (Fase 2, não é NF-e) e fluxo de caixa |

---

## 7. Qualidade, Testes, Rastreabilidade e Lições do Protótipo

### Rastreabilidade por ID e Padrão de Commits ([docs/README.md](../docs/README.md), [08-testes.md](../docs/08-testes.md), [commit-and-deploy](skills/commit-and-deploy/SKILL.md))
- Todo requisito possui um ID único: `RF-<MÓDULO>-NNN`, `RNF-NNN`, `RN-NNN` ou `ADR-NNNN`.
- **IDs nunca são reaproveitados.** Requisitos cancelados permanecem na tabela marcados como `Descartado`.
- Commits, PRs e blocos `describe`/`it` de testes **devem citar os IDs implementados**:
  - **Formato oficial de commit (duas partes — cabeçalho no infinitivo + corpo em bullets no presente):**
    ```text
    feat(appointments): detectar conflito de horário sem bloquear (RF-AGE-004, RN-006)

    - Implementa verificação de sobreposição de intervalo no AppointmentsService
    - Adiciona testes unitários e de isolamento entre organizações (RNF-004)
    ```
  - **Exemplo de teste:** `describe('RF-AGE-004 · conflito de horário', () => { it('avisa sem bloquear (RN-006)', ...) })`

### Testes Obrigatórios, Pré-Commit e CI ([08-testes.md](../docs/08-testes.md), [07-seguranca.md](../docs/07-seguranca.md))
- **Alinhamento Pré-commit vs CI:**
  - **Pré-commit local (`.githooks/pre-commit`):** Focado em feedback instantâneo (< 1s) para bloquear arquivos `.env`/`.env.*`/`.pem`/`.key` (exceto `.env.example`) e rodar `gitleaks git --staged --redact --verbose` antes do commit existir localmente.
  - **CI (`.github/workflows/ci.yml`):** Barreira completa no GitHub Actions (permissões mínimas `read`, cache de Bun, versões fixas via `.node-version` e `packageManager`) com 4 jobs paralelos: `security` (`gitleaks`), `shared` (`format:check` Prettier + lint/typecheck/build de `@infosys/shared`), `api` (`lint` Oxlint type-aware → `typecheck` → unitários Jest em Node 24.20.0 → `test:e2e` com Postgres 16 → `build`) e `web` (`lint` Oxlint type-aware → `typecheck` → Vitest → `build` Vite + PWA).
1. **Isolamento Multi-tenant (`RNF-004`):** Para cada controller/endpoint, testar com dois usuários de organizações distintas (Org A e Org B); Org B jamais pode ler, listar, editar ou excluir dados da Org A (deve receber `404`).
2. **Regras de Negócio (`RN-*`, `RNF-011`):** Meta de 100% de cobertura unitária (Jest na API, Vitest na Web) com ID no nome do teste.
3. **Precisão Monetária (`RN-011`):** Testes de cálculo de orçamento/totais usando `Decimal` e casos de arredondamento.
4. **Datas e Fuso Horário (`RN-012`):** Garantir que cálculo de recorrência (`RN-009`) não quebre em viradas de fuso.

### Armadilhas do Protótipo v0 que NÃO Devem Ser Repetidas ([licoes-do-prototipo.md](../docs/licoes-do-prototipo.md))
- Não usar `Float` para dinheiro nem `String` para datas/horários.
- Não usar strings livres ou nomes fixos de nicho (como "CFTV") para tipos de serviço: usar `service_type` configurável por organização.
- Não duplicar nome/telefone/endereço do cliente na tabela de agendamentos (manter apenas `customer_id`; snapshot imutável existe apenas em `quote.customer_snapshot`).
- Não rodar cron jobs em memória (`node-cron`) nem embutir Puppeteer/Chromium no processo HTTP da API.
- Não marcar funcionalidades como "concluídas" na documentação sem testes automatizados vinculados aos IDs.

---

## 8. Diagnóstico Atual da Documentação (Pontos em Aberto e Divergências Mapeadas)

Ao trabalhar no projeto, tenha ciência dos seguintes pontos atualmente em aberto na documentação:

1. **Divergência de Status nas ADRs:** O [roadmap.md](../docs/roadmap.md) marca `[✔] ADRs 0001–0009 decididas`, mas [docs/adr/README.md](../docs/adr/README.md) ainda exibe `⏳ Pendente` para:
   - `ADR-0001` (falta decisão final da licença *source-available*);
   - `ADR-0003` e `ADR-0009` (a seção "Decisão" já está preenchida com a Opção 1 em ambas, faltando apenas atualizar o badge de status após a PoC).
2. **Decisões Técnicas Pendentes da PoC:**
   - Confirmar se `API` e `Worker (pg-boss)` rodarão no mesmo processo no Render durante o MVP para economizar infraestrutura ([03-arquitetura.md](../docs/03-arquitetura.md)).
   - Validar funcionamento de `SET LOCAL app.organization_id` (RLS) junto ao connection pooler do Supabase em modo transação ([ADR-0003](../docs/adr/0003-multi-tenancy.md)).
   - Definir domínio final (`seudominio.com`), região do Supabase/Render ([ADR-0004](../docs/adr/0004-hospedagem-e-dominios.md)), limites de rate-limit e tamanho/tipos de upload ([06-api.md](../docs/06-api.md)).

