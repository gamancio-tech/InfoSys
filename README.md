# InfoSys

> Gestão para prestadores de serviço: agenda, clientes, orçamentos, histórico e avisos de manutenção recorrente em um só lugar.

<!-- TODO: trocar NomeDoProduto, escrever a frase acima em 1 linha, adicionar screenshots/GIF e link da demo -->

**Status:** em desenvolvimento (pré-MVP) · **Licença:** ver [ADR-0001](docs/adr/0001-licenca-e-modelo-de-negocio.md)

> ⚠️ **Código para consulta.** Este repositório é público para fins de portfólio.
> Uso, hospedagem e redistribuição não são permitidos, e não há suporte a self-hosting.
> <!-- TODO: ajustar o texto conforme a licença escolhida na ADR-0001 -->

## O problema

<!-- TODO (3-4 linhas): quem é o público, qual dor resolve. Dica: o aviso de manutenção recorrente é o diferencial. -->

## Funcionalidades

| Fase | Funcionalidades |
|---|---|
| MVP | Clientes e endereços · agenda · catálogo de produtos/serviços · orçamentos com modelo do sistema (PDF) · anotações · histórico do cliente · avisos de manutenção |
| Fase 2 | Faturas e cobrança · estoque · dashboard financeiro · exportação CSV/Excel |
| Fase 3 | Modelos Word/Excel do usuário · IA para modelos de PDF |

Detalhes em [roadmap](docs/roadmap.md) e [visão e escopo](docs/01-visao-e-escopo.md).

## Arquitetura em uma imagem

Ver [docs/03-arquitetura.md](docs/03-arquitetura.md) (diagramas C4).

## Stack

| Camada | Tecnologia |
|---|---|
| Front | React + TypeScript, Vite, Tailwind CSS, PWA (Vercel) |
| API | NestJS + TypeScript (Render), contrato OpenAPI gerado |
| Banco | PostgreSQL (Supabase) + Prisma |
| Arquivos | Supabase Storage (buckets privados) |
| Auth | Better Auth (organizations) |
| Jobs | pg-boss <!-- TODO: confirmar na ADR-0008 --> |
| E-mail | Resend + React Email <!-- TODO: confirmar --> |
| Runtime | Node.js em produção (Bun opcional como gerenciador de pacotes) — ver [ADR-0002](docs/adr/0002-runtime-node-vs-bun.md) |

## Como rodar localmente

<!-- TODO: preencher quando existir o docker-compose. Esqueleto: -->

```bash
git clone <repo> && cd <repo>
cp apps/api/.env.example apps/api/.env      # preencher variáveis
cp apps/web/.env.example apps/web/.env
docker compose up -d                        # Postgres local
bun install                                 # ou npm/pnpm
bun run db:migrate && bun run db:seed
bun run dev                                 # web: :5173 · api: :3000
```

Variáveis de ambiente e deploy: [docs/09-operacao.md](docs/09-operacao.md).

## Documentação

Índice completo em [docs/README.md](docs/README.md).

## Segurança

Para reportar vulnerabilidades, veja [SECURITY.md](SECURITY.md).
