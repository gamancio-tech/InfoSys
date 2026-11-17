# 01 · Visão e escopo

**Status:** Rascunho

## Problema

Prestadores de serviço (instalação, manutenção, assistência técnica) controlam clientes, agenda, orçamentos e finanças em planilhas, agendas de papel e WhatsApp. Perdem histórico, esquecem revisões periódicas e gastam tempo refazendo documentos.


## Público-alvo

- **Primário:** pequenas empresas e autônomos de serviços técnicos em campo (1 a ~10 técnicos).
- **Usuários dentro de cada empresa:** dono/administrador e técnicos, cada um com login individual.
- **Cliente-âncora:** Infotell (segurança eletrônica), que valida o produto em uso real.

## Proposta de valor

1. **Histórico completo por cliente**: serviços, orçamentos, anotações, equipamentos instalados.
2. **Aviso de manutenção recorrente**: o sistema lembra quando cada cliente precisa de revisão (receita recorrente para o prestador).
3. **Orçamento profissional em minutos**, reaproveitando catálogo e dados do cliente.
4. **Uso em campo**: mobile-first, instalável (PWA).

## Objetivos (12 meses)

- [ ] MVP em uso diário pela Infotell até 30/11/2026.
- [ ] 3 clientes pagantes até 01/0/2027.

## Dentro do escopo — MVP

Autenticação e organizações · clientes (múltiplos endereços, anotações, equipamentos) · agenda · catálogo de produtos e serviços · orçamentos com modelo do sistema exportando PDF · conversão orçamento → agendamento · planos de manutenção e avisos · histórico do cliente.

## Fora do escopo (decisão consciente)

| Item | Por quê | Reavaliar quando |
|---|---|---|
| Emissão de NF-e / NFS-e | Cada prefeitura tem regras; alta complexidade | Demanda de ≥ N clientes |
| Scraping de sites de fornecedores | Risco jurídico e fragilidade (ver [lições](licoes-do-prototipo.md)) | Fornecedor com API oficial |
| Importar PDF arbitrário como modelo | Exige editor visual de campos | Fase 3, com demanda |
| Escrita offline com sincronização | Alta complexidade (conflitos) | Pós-MVP (ver [ADR-0009](adr/0009-estrategia-offline.md)) |
| Self-hosting | Decisão de negócio | — |
| WhatsApp automático ao cliente final | Custo e API oficial | Pós-MVP |
| ERP completo (compras, contabilidade, RH) | Foco | Não planejado |
| App nativo iOS/Android | PWA atende | Se PWA limitar push no iOS |

Detalhes e justificativas em [ADR-0007](adr/0007-itens-fora-do-mvp.md).

## Restrições

- Time de uma pessoa, em paralelo a outras atividades, 8 horas por semana disponíveis.
- Orçamento de infraestrutura: R$30,00/mês.
- LGPD: o produto trata dados pessoais dos clientes dos clientes (ver [07](07-seguranca.md)).

## Riscos principais

| Risco | Impacto | Mitigação |
|---|---|---|
| Escopo crescer além do MVP | Nunca lançar | Lista "fora do escopo" + roadmap em fases |
| Vazamento entre organizações | Crítico | Testes de isolamento, ADR-0003 |
| Dependência de plano gratuito em produção | Instabilidade | Custo no planejamento |
| Complexidade de geração de documentos | Atraso | Modelo próprio primeiro (Fase 1) |
