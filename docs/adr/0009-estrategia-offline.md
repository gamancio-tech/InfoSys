# ADR-0009 · Estratégia offline do PWA

- **Status:** Proposta
- **Requisitos:** RF-PLT-001, RF-PLT-002

## Contexto
Técnicos trabalham em campo, às vezes sem sinal. "PWA" não implica escrita offline, que exige filas, resolução de conflitos e idempotência.

## Opções
1. **Instalável + leitura em cache** (agenda do dia, clientes recentes) — simples.
2. **Escrita offline com sincronização** — muito complexa.

## Decisão
**Opção 1 no MVP.** Cache de leitura com `vite-plugin-pwa` (stale-while-revalidate para dados do dia). Mostrar aviso claro "sem conexão: somente leitura".

## Consequências
- Push no iOS exige app instalado na tela inicial e tem limitações: o e-mail é o canal confiável dos avisos.
- Reavaliar após feedback real de técnicos sobre falta de sinal.
