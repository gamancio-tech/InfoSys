---
name: docs-sync
description: >-
  Analisa qualquer mudança, implementação, correção ou decisão realizada no projeto InfoSys
  para determinar seu impacto e identificar exatamente quais arquivos de documentação
  (docs/01 a 09, glossário, roadmap, ADRs, README, SECURITY e .agents/project-context.md)
  devem ser atualizados. Use esta skill OBRIGATORIAMENTE ao concluir qualquer tarefa,
  ao revisar PRs/commits ou quando o usuário pedir para atualizar ou revisar a documentação.
---

# Governança e Atualização de Documentação (`docs-as-code`) · InfoSys

No **InfoSys**, a documentação segue a convenção **docs-as-code** ([docs/README.md](../../../docs/README.md)): tudo é escrito em Markdown + Mermaid, versionado junto com o código, e **atualizar a documentação faz parte da Definição de Pronto (Definition of Done) de cada mudança**.

Esta skill define o procedimento obrigatório para avaliar o **impacto de cada mudança no projeto** e determinar **onde e como atualizar a documentação**.

---

## 1. Classificação de Impacto ao Projeto

Antes de decidir o que atualizar, classifique a mudança ou tarefa concluída em um dos 4 níveis de impacto abaixo:

| Nível de Impacto | O que caracteriza a mudança | Ação Documental Exigida |
|---|---|---|
| 🔴 **Crítico (Estrutural / Segurança / Dados / Arquitetura)** | Altera isolamento multi-tenant, autenticação/autorização (RBAC), tratamento de dados pessoais (LGPD), modelo de banco de dados (`schema.prisma`), escolha de tecnologia/provedor ou escopo do MVP. | **Obrigatória e Imediata:** Atualiza múltiplos documentos centrais (`03`, `04`, `07`, `09`), cria ou atualiza **ADR** em `docs/adr/` e sincroniza `.agents/project-context.md`. |
| 🟠 **Alto (Funcional / Domínio / Fluxo / Contrato)** | Adiciona ou altera funcionalidade de negócio, cria/modifica requisito (`RF-*`, `RN-*`, `RNF-*`), implementa fluxo crítico ou máquina de estados, adiciona job assíncrono (`pg-boss`) ou muda convenção transversal da API. | **Obrigatória:** Atualiza documentos de domínio e comportamento (`02`, `05`, `06`, `glossario`, `roadmap`) e sincroniza `.agents/project-context.md` se mudar regra nuclear. |
| 🟡 **Médio (Operacional / Qualidade / Setup)** | Adiciona variável de ambiente (`.env.example`), altera pipeline de CI, adiciona ferramenta/estratégia de teste, muda comando de setup local ou resolve um `<!-- TODO -->` existente na documentação. | **Obrigatória (Pontual):** Atualiza o documento específico da camada (`08-testes.md`, `09-operacao.md`, `README.md`) e remove o `TODO` resolvido. |
| 🟢 **Baixo ou Nulo (Interno / Cosmético)** | Refatoração interna de código que não altera assinatura pública nem estrutura de pastas, ajuste visual de CSS/UI dentro do padrão, correção de bug que apenas faz o código cumprir o requisito já documentado. | **Nenhuma alteração em `docs/`** (apenas reporte no checklist final que a mudança foi analisada e não gerou desvio documental). |

---

## 2. Mapa Detalhado: Onde Atualizar por Tipo de Mudança e Impacto

Use o guia abaixo para mapear cada tipo de alteração realizada aos documentos e seções exatas que devem ser atualizados.

---

### 2.1. Mudanças de Escopo, Produto ou Priorização de Fases
- **Gatilhos:** Inclusão de funcionalidade nova no MVP, adiamento de entrega para Fase 2/3, conclusão de marco do roadmap ou decisão de rejeitar uma funcionalidade.
- **Impacto ao Projeto:** 🔴 **Crítico / 🟠 Alto** — Afeta diretamente o prazo de lançamento do MVP (restrição de desenvolvedor solo com 8h/semana) e o compromisso com o cliente-âncora (Infotell).
- **Onde Atualizar:**
  1. **[docs/01-visao-e-escopo.md](../../../docs/01-visao-e-escopo.md):**
     - Seção `## Dentro do escopo — MVP`: se entrar ou sair um módulo do MVP.
     - Seção `## Fora do escopo (decisão consciente)`: se um item for explicitamente descartado/adiado (registrar *Item*, *Por quê* e *Reavaliar quando*).
     - Seção `## Riscos principais`: se surgir novo risco de projeto ou mitigação.
  2. **[docs/adr/0007-itens-fora-do-mvp.md](../../../docs/adr/0007-itens-fora-do-mvp.md):**
     - Atualizar a tabela caso um novo corte consciente de escopo seja feito no MVP.
  3. **[docs/roadmap.md](../../../docs/roadmap.md):**
     - Marcar tarefas concluídas com `[✔]` (ex.: itens da Fase 0, Fase 1, etc.) ou mover itens entre Fase 1, Fase 2, Fase 3 e "Antes do primeiro cliente pagante".
  4. **[README.md](../../../README.md):**
     - Atualizar a tabela `## Funcionalidades` caso o resumo público das Fases 1, 2 ou 3 mude.

---

### 2.2. Novos Requisitos Funcionais, Não Funcionais ou Regras de Negócio
- **Gatilhos:** Criação de uma nova feature, alteração no comportamento de uma regra (ex.: cálculo de manutenção, permissões de papel, numeração de orçamento) ou definição de meta de desempenho/cobertura.
- **Impacto ao Projeto:** 🟠 **Alto** — Altera o contrato funcional do sistema e a rastreabilidade exigida nos commits e testes automatizados.
- **Onde Atualizar:**
  1. **[docs/02-requisitos.md](../../../docs/02-requisitos.md):**
     - Seção `## 1. Requisitos funcionais`: adicionar ou atualizar linha na tabela do módulo correspondente (`AUT`, `CLI`, `AGE`, `MAN`, `CAT`, `ORC`, `EST`, `FIN/FAT`, `NOT`, `PLT`) preenchendo `ID`, `Requisito`, `Fase`, `Prio`, `Origem` e `Ok?`.
     - Seção `## 2. Requisitos não funcionais`: se mudar meta de SLA, latência, cobertura (`RNF-011`) ou compatibilidade (`RNF-001` a `RNF-012`).
     - Seção `## 3. Regras de negócio`: se criar ou refinar uma regra (`RN-001` a `RN-014+`).
     - ⚠️ **Regra de Ouro de IDs:** **NUNCA reaproveite nem apague um ID existente.** Se um requisito deixar de existir, mantenha o ID na tabela e marque-o como `Descartado`.
  2. **[docs/glossario.md](../../../docs/glossario.md):**
     - Sempre que o requisito introduzir um conceito novo no domínio, adicionar a definição em português, o identificador oficial em inglês entre parênteses (`snake_case`) e a coluna "Não confundir com".

---

### 2.3. Mudanças na Arquitetura, Estrutura de Pastas, Módulos ou Jobs Assíncronos
- **Gatilhos:** Criação de novo módulo em `apps/api/src/modules/*` ou `apps/api/src/platform/*`, criação de feature em `apps/web/src/features/*`, criação de novo job/fila no `pg-boss`, adição de serviço externo (ex.: gateway de pagamento, Gotenberg) ou separação entre processos API e Worker.
- **Impacto ao Projeto:** 🔴 **Crítico / 🟠 Alto** — Modifica a topologia de contêineres, o acoplamento entre módulos ou o modelo de execução assíncrona.
- **Onde Atualizar:**
  1. **[docs/03-arquitetura.md](../../../docs/03-arquitetura.md):**
     - `## C4 · Nível 1 — Contexto` e `## C4 · Nível 2 — Contêineres`: atualizar diagramas Mermaid se entrar novo sistema externo (ex.: Asaas/Stripe) ou mudar a topologia de deploy (Vercel / Render / Supabase).
     - `## Estrutura do repositório (monorepo)`: atualizar a árvore de diretórios se novos módulos de domínio, pacotes compartilhados ou serviços de plataforma forem criados.
     - `## Regras de dependência` e `## Estrutura de um módulo`: atualizar caso alguma convenção interna de módulo seja refinada.
     - `## Processos assíncronos`: adicionar qualquer novo job do `pg-boss` na tabela informando **Job**, **Gatilho**, **Fila** e **Chave de Idempotência** obrigatória.
     - `## Decisões em aberto`: marcar `[x]` quando uma decisão arquitetural pendente for fechada.
  2. **[README.md](../../../README.md):**
     - Atualizar a tabela `## Stack` caso uma biblioteca ou serviço da stack principal seja confirmado (ex.: confirmar `pg-boss`, `Resend + React Email`).

---

### 2.4. Alterações no Banco de Dados, Schema Prisma ou Migrations
- **Gatilhos:** Criação ou alteração de model/tabela, enum, relacionamento ou índice em `apps/api/prisma/schema.prisma`, ou criação de migration SQL.
- **Impacto ao Projeto:** 🔴 **Crítico** — Impacta persistência, integridade relacional, isolamento multi-tenant (`organization_id`) e conformidade com a LGPD.
- **Onde Atualizar:**
  1. **[docs/04-dados.md](../../../docs/04-dados.md):**
     - `## Convenções`: verificar se a mudança respeita `uuid`, `organization_id NOT NULL`, `Decimal(14,2)` para dinheiro, `timestamptz` em UTC e `archived_at` para soft delete.
     - `## Modelo conceitual (MVP)`: atualizar o diagrama Mermaid `erDiagram` com as entidades, colunas (`PK`, `FK`, tipos) e cardinalidades reais.
     - `## Dicionário de dados`: regenerar/atualizar a partir do `schema.prisma` (nunca manter dicionário divergente do schema).
     - `## Retenção e dados pessoais`: se a nova tabela/coluna armazenar dado pessoal ou sensível (ex.: CPF/CNPJ, telefone, e-mail, endereço, senhas de equipamentos em anotações, anexos), documentar na tabela de retenção.
  2. **[docs/glossario.md](../../../docs/glossario.md):**
     - Garantir que o nome da nova tabela em inglês (`snake_case`) conste no glossário com seu termo oficial em português.
  3. **[docs/07-seguranca.md](../../../docs/07-seguranca.md):**
     - Se houver novo dado pessoal ou sensível, atualizar as seções `## Dados sensíveis em anotações` ou `## LGPD`.

---

### 2.5. Implementação ou Alteração de Fluxos Críticos e Máquinas de Estado
- **Gatilhos:** Implementação ou mudança na lógica de transição de estados (Orçamento, Atendimento, Assinatura SaaS) ou em fluxos multi-etapas (Orçamento aprovado → agendamento, Ciclo do plano de manutenção e aviso, Convite de técnico, Cobrança e webhook).
- **Impacto ao Projeto:** 🟠 **Alto** — Esses são os fluxos de maior risco de bug transacional e perda de consistência entre API, banco e fila (`pg-boss`).
- **Onde Atualizar:**
  1. **[docs/05-fluxos.md](../../../docs/05-fluxos.md):**
     - Tabela inicial de fluxos: atualizar requisitos vinculados (`RF-*`, `RN-*`) se necessário.
     - Diagramas `sequenceDiagram` (Seções 1, 2, 5, 6): detalhar ou ajustar rotas, eventos de fila e regras de transação conforme implementado no código real.
     - Diagramas `stateDiagram-v2` (Seções 3, 4, 7): atualizar estados e transições permitidas (e remover os comentários `<!-- TODO -->` assim que as transições forem confirmadas).

---

### 2.6. Mudanças na API HTTP, Schemas Zod, Paginação, Erros ou Uploads
- **Gatilhos:** Criação de endpoints, alteração de políticas de versão, autenticação/CSRF, formato de erro, cursor de paginação, rate-limit ou limites de upload no Supabase Storage.
- **Impacto ao Projeto:** 🟠 **Alto** (quando muda convenção transversal) ou 🟢 **Baixo documental** (quando apenas adiciona uma rota padrão).
- **Onde Atualizar:**
  1. **Se for apenas uma nova rota ou DTO dentro do padrão:**
     - **NÃO liste rotas em `docs/06-api.md`!** O documento proíbe explicitamente listar endpoints manualmente porque a fonte de verdade é o OpenAPI gerado pelo NestJS (`/api/openapi.json`) a partir do `nestjs-zod`.
     - Certifique-se apenas de que os decorators/schemas Zod geram o contrato OpenAPI corretamente e que `bun run api:generate` atualiza o cliente tipado do frontend.
  2. **Se mudar uma convenção transversal da API → atualizar [docs/06-api.md](../../../docs/06-api.md):**
     - `## Base e versionamento`: mudança de versão (`/v1` → `/v2`) ou política de depreciação.
     - `## Autenticação`: atributos de cookie, sessão ou mecanismo de proteção CSRF.
     - `## Formato de erro`: estrutura do JSON de erro ou tabela de status HTTP (`400`, `401`, `403`, `404`, `409`, `422`, `429`, `5xx`).
     - `## Paginação, filtro e ordenação`: parâmetros de cursor, limite máximo (`100`) ou sintaxe de ordenação.
     - `## Limites` e `## Uploads e downloads`: ao definir os valores dos `TODO`s de rate-limit (por IP/organização), tamanho máximo de arquivo (MB) e tipos MIME permitidos (`png`, `jpg`, `pdf`).

---

### 2.7. Mudanças em Segurança, Permissões (RBAC), Multi-Tenancy ou Privacidade (LGPD)
- **Gatilhos:** Definição ou alteração da matriz de permissões (`permissions.ts`), ajustes no Better Auth, configuração de RLS/Prisma Extension, regras de buckets privados, `gitleaks` ou políticas LGPD.
- **Impacto ao Projeto:** 🔴 **Crítico** — Qualquer falha ou desatualização aqui representa risco de vazamento entre organizações (IDOR) ou violação legal (LGPD).Itens com 🔴 bloqueiam a entrada do primeiro cliente pagante.
- **Onde Atualizar:**
  1. **[docs/07-seguranca.md](../../../docs/07-seguranca.md):**
     - `## Autenticação e sessão`: parâmetros de hash, verificação de e-mail, lockout.
     - `## Autorização`: documentar a matriz de permissões por papel (`proprietário`, `administrador`, `técnico`) quando implementada em `apps/api/src/platform/auth/permissions.ts`.
     - `## Isolamento entre organizações 🔴`, `## Segredos`, `## Arquivos`, `## Dados sensíveis em anotações`, `## LGPD 🔴` e `## Ameaças principais`.
  2. **[docs/02-requisitos.md](../../../docs/02-requisitos.md):**
     - Atualizar `RN-001` caso a matriz de permissões do técnico/admin sofra ajustes.
  3. **[SECURITY.md](../../../SECURITY.md):**
     - Atualizar o domínio oficial em `## Escopo` quando `app.seudominio.com` for definido.

---

### 2.8. Mudanças na Estratégia de Testes, Pré-Commit, Factories ou Pipeline de CI
- **Gatilhos:** Configuração de Jest, Vitest, Supertest, Testcontainers, Playwright ou k6; criação de factories em `apps/api/test/factories`; alteração em `.githooks/pre-commit` ou nas etapas do GitHub Actions (`.github/workflows/ci.yml`); mudanças na meta de cobertura (`RNF-011`).
- **Impacto ao Projeto:** 🟡 **Médio / 🟠 Alto** — Define o alinhamento entre a barreira local rápida (`pre-commit`) e a barreira completa que bloqueia merge no servidor (`CI`).
- **Onde Atualizar:**
  1. **[docs/08-testes.md](../../../docs/08-testes.md):**
     - `## Pirâmide`, `## Obrigatórios (bloqueiam merge)`, `## Dados de teste`, `## Pré-commit e CI` e `## Metas`.
  2. **[docs/07-seguranca.md](../../../docs/07-seguranca.md):**
     - Se a mudança afetar a varredura de segredos (`gitleaks`) no `.githooks/pre-commit` ou no `.github/workflows/ci.yml`, atualizar a seção `## Segredos`.
  3. **[docs/02-requisitos.md](../../../docs/02-requisitos.md):**
     - Atualizar `RNF-011` e a referência ao script de rastreabilidade (`scripts/trace.sh`) quando implementado.

---

### 2.9. Mudanças em Variáveis de Ambiente, Docker, Deploy, Backup ou Observabilidade
- **Gatilhos:** Adição/remoção de variável em `.env.example`, criação/alteração de `docker-compose.yml` ou `Dockerfile`, configuração de deploy no Render/Vercel/Supabase, configuração do Sentry, execução de teste de restauração de backup ou novo procedimento de incidente.
- **Impacto ao Projeto:** 🔴 **Crítico / 🟡 Médio** — Desatualização aqui causa falha de deploy em produção ou atraso na resposta a incidentes (RTO/RPO).
- **Onde Atualizar:**
  1. **[docs/09-operacao.md](../../../docs/09-operacao.md):**
     - `## Ambientes`: URLs de Staging/Produção, região do Supabase e custo mensal estimado.
     - `## Variáveis de ambiente (.env.example)`: manter a tabela **100% sincronizada** com todas as variáveis de `apps/api/.env.example` e `apps/web/.env.example` (nunca incluir valores secretos reais!).
     - `## Deploy`: documentar imagem Docker, release command (`prisma migrate deploy` com `DIRECT_URL`), health check (`/health`) e rollback.
     - `## Backup e restauração 🔴`: registrar data e resultado dos testes trimestrais de restauração.
     - `## Observabilidade`, `## SLOs` e `## Runbook de incidentes`.
  2. **[README.md](../../../README.md):**
     - Atualizar a seção `## Como rodar localmente` se mudarem os comandos de setup, `docker compose`, migração, seed ou portas locais (`:5173`, `:3000`).

---

### 2.10. Novas Decisões Arquiteturais ou Alteração de Decisão Existente (ADRs)
- **Gatilhos:** Escolha de uma nova tecnologia/biblioteca estrutural, validação na PoC de uma ADR que estava `⏳ Pendente` (`ADR-0001`, `ADR-0003`, `ADR-0009`) ou necessidade de substituir uma decisão técnica anterior.
- **Impacto ao Projeto:** 🔴 **Crítico** — Registra a memória histórica da engenharia do projeto e evita rediscutir decisões já tomadas.
- **Onde Atualizar:**
  1. **[docs/adr/](../../../docs/adr/):**
     - **Se fechar uma ADR pendente (`0001`, `0003`, `0009`):** Atualizar o campo `- **Status:**` para `✅ Decidida` no arquivo da ADR, remover os checkboxes/TODOs pendentes da PoC e atualizar a coluna `Status` em [docs/adr/README.md](../../../docs/adr/README.md).
     - **Se for uma decisão arquitetural inédita:** Criar um novo arquivo numerado sequencialmente (`docs/adr/0011-nome-da-decisao.md`) seguindo o modelo [0000-template.md](../../../docs/adr/0000-template.md) e indexá-lo em [docs/adr/README.md](../../../docs/adr/README.md).
     - **Se uma decisão antiga mudar:** **NUNCA apague nem sobrescreva o histórico de uma ADR já decidida.** Crie uma nova ADR (`001X-...`) e atualize o status da ADR antiga para `Substituída por ADR-001X`.

---

### 2.11. Sincronização do Contexto de IA (`.agents/project-context.md`)
- **Gatilhos:** Qualquer atualização de impacto 🔴 **Crítico** ou 🟠 **Alto** realizada nos itens `2.1` a `2.10`.
- **Impacto ao Projeto:** 🟠 **Alto** — Garante que futuras sessões de IA não operem com premissas desatualizadas.
- **Onde Atualizar:**
  1. **[.agents/project-context.md](../../project-context.md):**
     - Atualizar a seção correspondente (Resumo das ADRs, Estrutura do Monorepo, Regras de Negócio, Vocabulário ou Diagnóstico de Pontos em Aberto).

---

## 3. Regras de Ouro ao Editar a Documentação

1. **Resolução Proativa de `TODO`s:**
   - A documentação possui marcações `<!-- TODO: ... -->` e `TODO`. Sempre que uma tarefa ou confirmação do usuário resolver um desses pontos, **substitua o `TODO` pela decisão concreta** no documento correspondente.
2. **Ciclo de Vida de Status dos Documentos ([docs/README.md](../../../docs/README.md)):**
   - Os documentos iniciam como `**Status:** Rascunho`. Quando uma seção/documento tiver seus `TODO`s resolvidos e validados pelo usuário ou pela implementação, avance seu status para `Revisado` ou `Vigente`.
3. **Documento Estático:**
   - [docs/licoes-do-prototipo.md](../../../docs/licoes-do-prototipo.md) é um registro histórico estático (`Status: Vigente (estático)`). A única seção que deve ser preenchida nele no futuro é `## Plano de migração dos dados da Infotell` quando o modelo de dados estabilizar.
4. **Higiene de Segredos e Dados Sensíveis:**
   - O repositório é público ([ADR-0001](../../../docs/adr/0001-licenca-e-modelo-de-negocio.md)). Jamais inclua chaves reais, senhas, URLs internas privadas do banco ou dados pessoais reais de clientes da Infotell em exemplos de documentação.
5. **Concisão e Diagramas Mermaid:**
   - Mantenha o estilo direto e enxuto da documentação atual. Prefira tabelas e diagramas Mermaid (`flowchart`, `sequenceDiagram`, `stateDiagram-v2`, `erDiagram`) a textos longos.

---

## 4. Procedimento Passo a Passo (Checklist Pós-Tarefa)

Ao concluir qualquer tarefa no InfoSys, execute mentalmente (e aplique com as ferramentas de leitura/edição) os 4 passos abaixo:

1. **Inventariar o que mudou:** Liste os arquivos de código, schema, configuração ou decisões afetados na tarefa.
2. **Cruzar com a Seção 2 desta Skill:** Verifique em quais das categorias (`2.1` a `2.11`) a mudança se enquadra e qual o nível de impacto (🔴, 🟠, 🟡, 🟢).
3. **Aplicar as atualizações documentais:** Edite os arquivos de `docs/` e `.agents/project-context.md` na mesma tarefa, antes de encerrar a resposta.
4. **Reportar ao usuário:** Inclua no final da entrega um resumo conciso de governança documental:
   - **Impacto Documental:** `[🔴 Crítico | 🟠 Alto | 🟡 Médio | 🟢 Nulo]`
   - **Documentos Atualizados:** Lista com links para os arquivos atualizados (ou justificativa objetiva caso nenhum documento precise de alteração).

