# ADR-0010 · Banco, ORM e contrato da API

- **Status:** ✅ Decidida

## Decisão
- **PostgreSQL no Supabase** (apenas Postgres + Storage; sem Neon, para reduzir fornecedores).
- **Prisma** como ORM; `directUrl` para migrations.
- **Contrato pelo NestJS:** schemas Zod (`nestjs-zod`) validam a entrada e geram o OpenAPI; o cliente tipado do front é **gerado** a partir do OpenAPI.
- Monorepo com `packages/shared` para enums e schemas comuns.

## Consequências
- Sem tipos de API escritos à mão no front.
- Isolamento por tenant na camada da aplicação (ADR-0003), pois não usamos Supabase Auth.
