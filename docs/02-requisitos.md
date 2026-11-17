# 02 · Requisitos

**Status:** Rascunho — pré-preenchido a partir do questionário do protótipo e das decisões de produto.

**Colunas:** `Origem` = **Q** (questionário do protótipo) · **P** (proposto, precisa da sua confirmação) · **D** (decisão já tomada).
`Fase` = 1 MVP · 2 · 3 · `Prio` = M (Must) · S (Should) · C (Could).
Marque **✔ confirmado** apagando o `?` na coluna `Ok?` quando revisar.

## 1. Requisitos funcionais

### Autenticação e organização (AUT)

| ID | Requisito | Fase | Prio | Origem | Ok? |
|---|---|---|---|---|---|
| RF-AUT-001 | Cadastro e login com e-mail e senha | 1 | M | D | X |
| RF-AUT-002 | Login com Google | 1 | M | Q | X |
| RF-AUT-003 | Recuperação de senha por e-mail | 1 | M | Q | X |
| RF-AUT-004 | Ao se cadastrar, o usuário cria uma organização e vira proprietário | 1 | M | D | X |
| RF-AUT-005 | Proprietário/admin convida técnicos por e-mail, cada um com login individual | 1 | M | D | X |
| RF-AUT-006 | Proprietário/admin pode desativar um membro | 1 | M | D | X |
| RF-AUT-007 | Papéis: proprietário, administrador, técnico, com permissões distintas (ver RN-001) | 1 | M | D | X |
| RF-AUT-008 | 2FA opcional por e-mail/TOTP | 2 | C | Q | X |

### Clientes (CLI)

| ID | Requisito | Fase | Prio | Origem | Ok? |
|---|---|---|---|---|---|
| RF-CLI-001 | Cadastrar, editar, buscar e arquivar clientes (nome, telefone, e-mail, documento) | 1 | M | Q | X |
| RF-CLI-002 | Um cliente pode ter múltiplos endereços, com título opcional | 1 | M | Q | X |
| RF-CLI-003 | Anotações livres anexadas ao cliente (ex.: senhas), com autor e data | 1 | M | Q | X |
| RF-CLI-004 | Registrar equipamentos instalados por cliente (modelo, série, data, endereço) | 1 | M | Q | X |
| RF-CLI-005 | Linha do tempo do cliente: atendimentos, orçamentos, anotações, manutenções | 1 | M | D | X |
| RF-CLI-006 | Aviso visual quando o cliente tem pendência financeira (não bloqueia agendamento) | 2 | S | Q | X |
| RF-CLI-007 | Atalhos de contato (ligar, WhatsApp, abrir rota no mapa) | 1 | S | Q | X |
| RF-CLI-008 | Cadastro rápido de cliente durante a criação de um agendamento | 1 | S | Q | X |

### Agenda (AGE)

| ID | Requisito | Fase | Prio | Origem | Ok? |
|---|---|---|---|---|---|
| RF-AGE-001 | Criar, editar, reagendar e cancelar atendimentos | 1 | M | Q | X |
| RF-AGE-002 | Visões dia, semana, mês e lista; mobile-first | 1 | M | Q | X |
| RF-AGE-003 | Tipos de atendimento configuráveis por organização | 1 | M | P | X |
| RF-AGE-004 | Detectar conflito de horário e avisar, sem bloquear (técnico pode ter mais de um no mesmo horário) | 1 | M | Q | X |
| RF-AGE-005 | Atribuir técnico responsável; técnico vê sua própria agenda | 1 | M | P | X |
| RF-AGE-006 | Associar materiais/itens usados ao atendimento (opcional) | 1 | S | Q | X |
| RF-AGE-007 | Ao concluir, oferecer gerar nota de serviço e registrar materiais | 2 | S | Q | X |
| RF-AGE-008 | Reordenar atendimentos do dia (arrastar) | 1 | C | Q | X |
| RF-AGE-009 | Checklist "instalado" por item, em campo | 2 | C | Q | X |

### Planos de manutenção e avisos (MAN) — diferencial do produto

| ID | Requisito | Fase | Prio | Origem | Ok? |
|---|---|---|---|---|---|
| RF-MAN-001 | Criar plano de manutenção por cliente/equipamento com periodicidade (dias/meses/anos) | 1 | M | D | X |
| RF-MAN-002 | Ao concluir um atendimento vinculado a um plano, recalcular a próxima data | 1 | M | P | X |
| RF-MAN-003 | Gerar aviso quando faltar N dias para o vencimento (N configurável) | 1 | M | D | X |
| RF-MAN-004 | Listar manutenções vencidas e próximas, com ação "agendar" em um clique | 1 | M | P | X |
| RF-MAN-005 | Entregar avisos ao prestador por e-mail e push | 1 | M | P | X |
| RF-MAN-006 | Enviar aviso ao cliente final (e-mail) | 3 | C | P | X |

### Catálogo (CAT)

| ID | Requisito | Fase | Prio | Origem | Ok? |
|---|---|---|---|---|---|
| RF-CAT-001 | CRUD de produtos (nome, marca, preço de custo, margem, preço de venda, foto) | 1 | M | Q | X |
| RF-CAT-002 | CRUD de serviços com preço de referência | 1 | M | P | X |
| RF-CAT-003 | Produto avulso: criar item só para um orçamento, sem salvar no catálogo | 1 | M | Q | X |
| RF-CAT-004 | Criar produto no catálogo a partir do orçamento | 1 | S | Q | X |
| RF-CAT-005 | Importar catálogo/tabela de preços por CSV ou Excel | 2 | S | P | X |
| RF-CAT-006 | Histórico de alterações de preço | 2 | C | Q | X |
| RF-CAT-007 | Integração com fornecedor por API oficial (interface de adaptador) | 3 | C | Q/P | X |

### Orçamentos (ORC)

| ID | Requisito | Fase | Prio | Origem | Ok? |
|---|---|---|---|---|---|
| RF-ORC-001 | Criar orçamento com cliente, itens (catálogo ou avulsos), desconto, acréscimo, mão de obra, validade | 1 | M | Q | X |
| RF-ORC-002 | Numeração sequencial **por organização** e por ano (ex.: ORC-2026-0001), editavel | 1 | M | Q/P | X |
| RF-ORC-003 | Estados: pendente, aprovado, rejeitado, cancelado (ver [05](05-fluxos.md)) | 1 | M | Q | X |
| RF-ORC-004 | Gerar PDF com modelo do sistema (logo, cores, textos, PIX/dados bancários) | 1 | M | D | X |
| RF-ORC-005 | Converter orçamento aprovado em agendamento com materiais pré-preenchidos | 1 | M | Q | X |
| RF-ORC-006 | O orçamento guarda cópia (snapshot) dos dados do cliente e preços no momento da emissão | 1 | M | P | X |
| RF-ORC-007 | Compartilhar PDF (download e link/WhatsApp) | 1 | S | P | X |
| RF-ORC-008 | Modelo Word com placeholders → PDF | 3 | C | D | X |
| RF-ORC-009 | Importar modelo PDF arbitrário | 3 | C | D | X |

### Estoque (EST)

| ID | Requisito | Fase | Prio | Origem | Ok? |
|---|---|---|---|---|---|
| RF-EST-001 | Quantidade em estoque por produto, com entrada e saída manuais | 2 | M | Q | X |
| RF-EST-002 | Estoque mínimo e alerta de reposição | 2 | S | P | X |
| RF-EST-003 | Saída automática ao concluir atendimento com materiais (opcional) | 2 | C | P | X |
| RF-EST-004 | A venda/orçamento **não** é bloqueada por falta de estoque | 2 | M | Q | X |

### Financeiro e faturas (FIN / FAT)

| ID | Requisito | Fase | Prio | Origem | Ok? |
|---|---|---|---|---|---|
| RF-FIN-001 | Registrar receitas e despesas (manual) | 2 | M | Q | X |
| RF-FIN-002 | Receita criada automaticamente ao concluir atendimento com valor cobrado | 2 | S | Q | X |
| RF-FIN-003 | Categorias de despesa personalizadas, com recorrência (ex.: almoço, combustível) | 2 | S | Q | X |
| RF-FIN-004 | Dashboard: despesa do mês, lucro do dia, contas a pagar | 2 | M | Q | X |
| RF-FIN-005 | Filtros personalizáveis no dashboard | 2 | C | Q | X |
| RF-FIN-006 | Exportar lançamentos para CSV/Excel | 2 | M | D | X |
| RF-FIN-007 | Importar planilha do usuário com mapeamento de colunas | 3 | C | D | X |
| RF-FIN-008 | Preencher modelo Excel do usuário e exportar | 3 | C | D | X |
| RF-FAT-001 | Gerar fatura a partir de atendimento/orçamento | 2 | M | D | X |
| RF-FAT-002 | Parcelamento e contas a receber | 2 | S | Q | X |
| RF-FAT-003 | Cobrança por Pix/boleto via gateway; atualização por webhook | 2 | S | P | ? |

### Anotações gerais (NOT)

| ID | Requisito | Fase | Prio | Origem | Ok? |
|---|---|---|---|---|---|
| RF-NOT-001 | Criar anotações livres (com ou sem cliente associado) | 1 | S | D | X |
| RF-NOT-002 | Anexar arquivos/fotos a anotações, atendimentos e clientes | 1 | S | P | X |

### Plataforma (PLT)

| ID | Requisito | Fase | Prio | Origem | Ok? |
|---|---|---|---|---|---|
| RF-PLT-001 | PWA instalável com leitura em cache | 1 | M | D | X |
| RF-PLT-002 | Escrita offline com sincronização | — | — | — | Fora (ADR-0009) |
| RF-PLT-003 | Planos, limites, trial e cobrança do SaaS | 2 | M | P | X |
| RF-PLT-004 | Exportar todos os dados da organização (portabilidade, LGPD) | 2 | S | P | X |

## 2. Requisitos não funcionais


| ID | Categoria | Requisito mensurável | Como verificar |
|---|---|---|---|
| RNF-001 | Desempenho | p95 de leitura de listas < 500 ms com 50 usuários simultâneos | Teste de carga (k6) |
| RNF-002 | Desempenho | Geração de PDF de orçamento < 10 s (assíncrona se > 3 s) | Teste automatizado |
| RNF-003 | Disponibilidade | ≥ 99,5% mensal (≈ 3,6 h de indisponibilidade/mês) | Monitor externo |
| RNF-004 | Segurança | Zero vazamento entre organizações | Suíte de isolamento no CI |
| RNF-005 | Segurança | Sessão em cookie `HttpOnly`, `Secure`, `SameSite` | Teste e2e |
| RNF-006 | Backup | RPO ≤ 24 h, RTO ≤ 4 h; restauração testada trimestralmente | Runbook |
| RNF-007 | Usabilidade | Telas principais utilizáveis em 360 px de largura | Revisão manual |
| RNF-008 | Acessibilidade | Contraste e navegação por teclado nas telas principais (WCAG AA como meta) | Lighthouse |
| RNF-009 | Observabilidade | Erros no Sentry; logs estruturados com `organizationId` e `requestId` | Revisão |
| RNF-010 | Privacidade | Dados pessoais mapeados e com prazo de retenção (LGPD) | [07](07-seguranca.md) |
| RNF-011 | Manutenibilidade | Cobertura mínima de testes nas regras de negócio: TODO % | CI |
| RNF-012 | Compatibilidade | Últimas 2 versões de Chrome, Safari (iOS) e Firefox | Teste manual |

## 3. Regras de negócio

| ID | Regra | Origem |
|---|---|---|
| RN-001 | **Permissões:** proprietário e administrador acessam tudo (incluindo financeiro e configurações). Técnico acessa clientes, agenda própria e orçamentos; **não** vê financeiro nem edita preços de custo. <!-- TODO: confirmar matriz --> | P |
| RN-002 | Todo dado pertence a exatamente uma organização; nenhuma consulta cruza organizações. | D |
| RN-003 | Preço do fornecedor com variação acima de 25% exige revisão humana; se rejeitado, mantém-se o preço antigo e o produto exibe alerta de divergência. | Q |
| RN-004 | Cliente com pendência financeira mostra aviso visual, mas **não** é bloqueado. | Q |
| RN-005 | Falta de estoque **não** impede orçamento nem agendamento. | Q |
| RN-006 | Um técnico pode ter mais de um atendimento no mesmo horário; o sistema avisa do conflito. | Q |
| RN-007 | Orçamento aprovado pode gerar agendamento; os itens do orçamento viram materiais previstos do atendimento. | Q |
| RN-008 | Orçamento emitido é imutável nos valores; alterações geram nova revisão. <!-- TODO: confirmar --> | P |
| RN-009 | Próxima manutenção = data de conclusão do último atendimento vinculado + periodicidade do plano. | P |
| RN-010 | Aviso de manutenção é gerado quando `próxima data − antecedência ≤ hoje` e ainda não foi gerado para aquele ciclo. | P |
| RN-011 | Valores monetários usam precisão decimal (nunca ponto flutuante) e moeda BRL. | P |
| RN-012 | Datas e horas são armazenadas em UTC e exibidas no fuso da organização. | P |
| RN-013 | Numeração de orçamento é única e sequencial por organização/ano, sem lacunas por cancelamento. | P |
| RN-014 | Excluir cliente com histórico apenas arquiva (exclusão definitiva só sob pedido LGPD). | P |

## 4. Rastreabilidade (sem planilha)

Não mantemos matriz manual. A ligação requisito → código → teste é feita por **ID em commits, PRs, issues e nomes de teste**:

```ts
describe('RF-AGE-004 · conflito de horário', () => {
  it('avisa quando o técnico já tem atendimento no intervalo (RN-006)', ...)
})
```

Verificação de cobertura: `scripts/trace.sh` <!-- TODO: opcional; lista RF "Fase 1 / Must" sem nenhuma ocorrência em test/ -->.
