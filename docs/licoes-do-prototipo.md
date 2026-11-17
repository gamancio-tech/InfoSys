# Lições do protótipo (Infotell v0)

**Status:** Vigente (estático). Registro do que o protótipo de uso próprio ensinou antes da reescrita para SaaS.

## O que o protótipo entregou

~23 mil linhas em TypeScript: Express 5 + Prisma 6 (backend), React 19 + Vite + Tailwind 4 (frontend), PWA básico. Módulos: catálogo com sincronização de preços de fornecedor, agenda, clientes, orçamentos com PDF/templates, autenticação própria (JWT, refresh rotativo, 2FA por e-mail, Google, aprovação de contas).

## O que funcionou e vira requisito

| Aprendizado | Onde aparece agora |
|---|---|
| Agenda mobile-first com conflito de horário apenas como aviso | RF-AGE-002/004, RN-006 |
| Orçamento com item de catálogo **ou** avulso | RF-CAT-003/004 |
| Orçamento aprovado → agendamento com materiais | RF-ORC-005, RN-007 |
| Revisão humana de variação de preço do fornecedor | RN-003 |
| Atalhos de contato (ligar, WhatsApp, GPS) | RF-CLI-007 |
| Organização do front por feature | [03](03-arquitetura.md) |

## O que não funcionou (e por quê)

| Problema | Causa | Correção |
|---|---|---|
| Sem noção de organização | Uso de uma empresa só | ADR-0003 |
| Dinheiro em `Float`; datas em texto | Modelagem rápida | [04](04-dados.md) |
| Tipos/estados como texto livre, nomes de domínio fixos (CFTV) | Foco em um nicho | `service_type` configurável |
| Cliente com um endereço e uma observação | Modelo simplificado | RF-CLI-002/003 |
| Estoque = booleano do fornecedor | Vinha do scraping | RF-EST-* (Fase 2) |
| Financeiro só em `useState`, sem backend | Prioridade | Fase 2 |
| Autenticação feita à mão | Aprendizado | ADR-0005 |
| `node-cron` na API, Puppeteer no mesmo processo | Simplicidade inicial | ADR-0008, ADR-0006 |
| Documentação marcando "100% concluído" com muitos bugs | Status por intenção, não por verificação | Status honestos + testes ligados a IDs |
| Plano de refatoração padronizando Express | Dívida acumulada | Reescrita em módulos NestJS |

## Decisões descartadas

- **Scraping do fornecedor com bypass de anti-bot:** risco jurídico e frágil. Mantém-se só a interface `ISupplierClient` ([ADR-0007](adr/0007-itens-fora-do-mvp.md)).
- **IA para extrair modelo de PDF:** funciona como experimento; vai para a Fase 3.

## Reaproveitável

- Textos de regras de negócio e o questionário (`docs/QUESTIONARIO_SERVICOS.md`) como fonte para validar requisitos.
- Fluxo de PDF de orçamento como referência de layout.
- Dados reais da Infotell (clientes, produtos, orçamentos) para o plano de migração.

## Plano de migração dos dados da Infotell

<!-- TODO: escrever depois do modelo de dados estabilizado: exportar do banco atual → script de importação → conferência → cutover. Lembrar de criar a organização "Infotell" primeiro. -->
