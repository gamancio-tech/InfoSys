# Governança de Commit, CI e Deploy · InfoSys

Esta regra aplica-se permanentemente a todas as operações de Git, CI e deploy no workspace **InfoSys**:

1. **Ativação da Skill `commit-and-deploy`:**
   - Sempre que for realizar um `git commit`, alterar hooks em `.githooks/`, editar workflows em `.github/workflows/` ou configurar scripts/ambientes de deploy, siga a skill **`commit-and-deploy`** ([.agents/skills/commit-and-deploy/SKILL.md](../skills/commit-and-deploy/SKILL.md)).

2. **Padrão Obrigatório de Mensagem de Commit:**
   - Utilize **Conventional Commits em português** estruturado em duas partes (`git commit -m "<cabeçalho>" -m "<corpo>"`):
     - **Cabeçalho:** `<tipo>(<escopo>): <resumo no infinitivo> (<IDs: RF-*, RN-*, RNF-*, ADR-*>)`
     - **Corpo:** lista de bullets (`- <Verbo no presente> <detalhe objetivo>`) detalhando cada alteração técnica e a sincronização documental correspondente.

3. **Travas de Segurança e Qualidade Antes do Commit:**
   - **Documentação sincronizada (`docs-sync`):** código e atualização de documentação (`docs/*` e `.agents/project-context.md`) devem entrar no **mesmo commit**.
   - **Proteção de segredos:** nunca adicione `.env` (apenas `.env.example`), `*.pem` ou `*.key` ao stage, e **jamais** use `git commit --no-verify` para pular o `.githooks/pre-commit`.
   - **Alinhamento com o CI:** ao modificar código em `apps/` ou `packages/`, valide localmente `bun run format:check`, `bun run lint`, `bun run typecheck` e `bun run test` (Jest sobre Node `>= 24.20.0`) antes de comitar.

