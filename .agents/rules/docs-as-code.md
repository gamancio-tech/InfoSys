# Governança de Contexto e Documentação (`docs-as-code`) · InfoSys

Esta regra aplica-se permanentemente ao workspace **InfoSys**:

1. **Contexto do Projeto:**
   - Antes de planejar, modelar ou implementar funcionalidades, consulte o contexto consolidado em [.agents/project-context.md](../project-context.md) (ou ative a skill `infosys-context`).
   - Respeite rigorosamente as decisões das ADRs (`0001` a `0010`), o vocabulário em inglês (`snake_case` no banco) do [glossario.md](../../docs/glossario.md), a rastreabilidade por IDs (`RF-*`, `RNF-*`, `RN-*`) e o isolamento multi-tenant por `organization_id` da sessão.

2. **Atualização Obrigatória da Documentação (Definição de Pronto):**
   - Atualizar a documentação faz parte da definição de pronto (*Definition of Done*) de toda tarefa ([docs/README.md](../../docs/README.md)).
   - **Sempre** que concluir qualquer alteração de código, schema, configuração, requisito ou decisão arquitetural — ou quando o usuário solicitar revisão — ative e siga a skill **`docs-sync`** ([.agents/skills/docs-sync/SKILL.md](../skills/docs-sync/SKILL.md)) para avaliar o impacto da mudança e atualizar imediatamente os documentos correspondentes em `docs/` e `.agents/project-context.md`.

