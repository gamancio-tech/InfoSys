# ADR-0007 · Itens fora do MVP

- **Status:** Proposta

## Contexto
Time de uma pessoa. O protótipo mostrou que escopo largo gera bugs e código sem planejamento.

## Decisão
Ficam fora do MVP (Fase 1):

| Item | Motivo | Gatilho para reavaliar |
|---|---|---|
| NF-e / NFS-e | Complexidade fiscal por município | Pedido recorrente de clientes |
| Scraping de fornecedores | Contorna proteção anti-bot, risco jurídico, frágil, exige credenciais de terceiros | Fornecedor com API oficial |
| IA (Gemini) para modelos de PDF | Custo por uso, resultado variável, dados de clientes enviados a terceiro (LGPD) | Fase 3 com demanda |
| PDF arbitrário, Word, Excel do usuário | Mais caros e menos necessários para validar o produto | Fase 3 |
| Faturas, estoque, dashboard financeiro | Dependem de dados confiáveis do núcleo | Fase 2 |
| Escrita offline | Ver ADR-0009 | Pós-MVP |
| WhatsApp automático | API oficial, custo, opt-in | Pós-MVP |

## Consequências
O MVP prova a proposta de valor (histórico + manutenção recorrente + orçamento) com o menor custo.
A interface de adaptador de fornecedor (`ISupplierClient`) do protótipo pode ser reaproveitada depois.
