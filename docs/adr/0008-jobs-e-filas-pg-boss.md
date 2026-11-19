# ADR-0008 · Jobs e filas

- **Status:** ✅ Decidida 
- **Requisitos:** RF-MAN-003, RF-MAN-005, RF-ORC-004

## Contexto
O protótipo usava `node-cron` dentro da API: com mais de uma instância, o job roda duplicado, e falhas se perdem.

## Opções
1. **pg-boss** (usa o Postgres) — sem Redis; transações com os dados.
2. **BullMQ + Redis** — mais recursos, mais infraestrutura.
3. **Cron externo chamando endpoint** — frágil.

## Decisão
**pg-boss**, com jobs **idempotentes**. Exige conexão direta ou em modo sessão com o banco (ver ADR-0004). 

## Consequências
- Menos fornecedores. Se a carga crescer, migrar para BullMQ atrás da interface `QueueService`.
