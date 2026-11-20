# Documentação

Convenção: **docs-as-code**. Tudo em Markdown + Mermaid, versionado com o código. Atualizar a documentação faz parte da definição de pronto de cada mudança.

## Índice

| # | Documento | Para quê | Quando atualizar |
|---|---|---|---|
| 01 | [Visão e escopo](01-visao-e-escopo.md) | Problema, público, o que está dentro **e fora** | Ao mudar o escopo |
| 02 | [Requisitos](02-requisitos.md) | RF, RNF e RN com IDs | A cada funcionalidade nova |
| 03 | [Arquitetura](03-arquitetura.md) | C4, estrutura de pastas, regras de camadas | Ao mudar a estrutura |
| 04 | [Dados](04-dados.md) | Modelo ER, multi-tenancy, dicionário | A cada migration relevante |
| 05 | [Fluxos](05-fluxos.md) | Sequência e estados dos fluxos críticos | Ao implementar cada fluxo |
| 06 | [API](06-api.md) | Convenções (o contrato real é o OpenAPI) | Raramente |
| 07 | [Segurança e privacidade](07-seguranca.md) | Autorização, dados pessoais, LGPD | Antes do 1º cliente |
| 08 | [Testes](08-testes.md) | Estratégia e ligação com requisitos | Ao mudar a estratégia |
| 09 | [Operação](09-operacao.md) | Ambientes, deploy, backup, runbook | Junto com o deploy |
| — | [Glossário](glossario.md) | Vocabulário único do domínio | Sempre que surgir termo novo |
| — | [Roadmap](roadmap.md) | Fases e prioridades | A cada ciclo |
| — | [Lições do protótipo](licoes-do-prototipo.md) | O que o protótipo ensinou | Estático |
| — | [ADRs](adr/) | Decisões de arquitetura e por quê | Uma nova por decisão |

## Convenção de IDs e Commits

- `RF-<MÓDULO>-NNN` requisito funcional · `RNF-NNN` não funcional · `RN-NNN` regra de negócio · `ADR-NNNN` decisão arquitetural.
- IDs **nunca** são reaproveitados. Requisito removido fica marcado como `Descartado`.
- **Padrão de commits (Conventional Commits em português):** cabeçalho no infinitivo com IDs entre parênteses + corpo em bullets iniciados por verbo no presente:
  ```text
  feat(appointments): detectar conflito de horário sem bloquear (RF-AGE-004, RN-006)

  - Implementa verificação de sobreposição de intervalo no AppointmentsService
  - Adiciona testes unitários e de isolamento entre organizações (RNF-004)
  ```
- Para listar a cobertura: `git log --grep "RF-AGE-004"` e `grep -r "RF-AGE-004" apps/ test/`.

## Status de documento

`Rascunho` → `Revisado` → `Vigente`. Marcações `TODO` indicam o que ainda precisa de decisão humana.
