# ADR-0003 · Multi-tenancy

- **Status:** Proposta
- **Requisitos:** RN-002, RNF-004

## Contexto
Cada organização cliente só pode ver seus dados. Vazamento entre organizações é o maior risco de segurança de um SaaS. Como a autenticação é do Better Auth (não do Supabase Auth), o RLS baseado em `auth.uid()` não se aplica.

## Opções
1. **Banco único, coluna `organization_id`** — simples, barato, fácil de migrar e consultar; depende de disciplina.
2. **Schema por organização** — isolamento melhor, migrations mais pesadas.
3. **Banco por organização** — isolamento máximo, custo e operação altos demais para 1 pessoa.

## Decisão
**Opção 1**, com três camadas:
1. **Cliente Prisma com escopo** (Prisma Client extension) que injeta `organization_id` em toda leitura/escrita; módulos nunca montam o filtro à mão.
2. **RLS no Postgres** via `SET LOCAL app.organization_id` dentro de transação, como defesa em profundidade. <!-- TODO: validar com pooler (modo transação) do Supabase e com Prisma na PoC -->
3. **Teste de isolamento por endpoint** no CI.

A organização ativa vem da **sessão**, nunca de parâmetro.

## Consequências
- Toda tabela de domínio exige `organization_id` + índice composto nas consultas frequentes.
- Consultas "globais" (jobs) usam um cliente explícito e nomeado, com revisão obrigatória.
- Migrar um cliente grande para banco próprio, no futuro, é possível filtrando por `organization_id`.
