# @infosys/web

> Frontend Web e PWA do **InfoSys** — Aplicação mobile-first em **React 19 + TypeScript + Vite 8 + Tailwind CSS v4** para gestão operacional de prestadores de serviço técnico em campo (agenda, clientes, catálogo, orçamentos e avisos de manutenção recorrente).

---

## Stack Configurada

- **UI & Estilo:** React 19 + TypeScript + **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Build & PWA ([ADR-0009](../../docs/adr/0009-estrategia-offline.md), `RF-PLT-001`):** Vite 8 + **`vite-plugin-pwa`** (manifest instalável PT-BR e cache de leitura Workbox *Stale-While-Revalidate* para endpoints `/v1/appointments|customers|maintenance|quotes|catalog`)
- **Contrato de API ([ADR-0010](../../docs/adr/0010-dados-e-contrato-da-api.md), [docs/06-api.md](../../docs/06-api.md)):** **`openapi-typescript` + `openapi-fetch`** (`src/shared/api/client.ts` com `credentials: 'include'`)
- **Testes & Qualidade ([docs/08-testes.md](../../docs/08-testes.md)):** **Vitest** + **React Testing Library** + **JSDOM**, **Oxlint** e **Prettier**

---

## Arquitetura e Estrutura de Pastas

A organização do frontend espelha os módulos de domínio da API conforme definido em [docs/03-arquitetura.md](../../docs/03-arquitetura.md):

```text
apps/web/
  src/
    features/           # Módulos por domínio (customers, appointments, maintenance,
                        # quotes, catalog, inventory, finance, invoices, notes)
    shared/             # Componentes de UI, hooks (ex.: useOnlineStatus) e api/client.ts
    app/                # Rotas, providers globais e configuração do PWA
    test/               # Setup global do Vitest + Testing Library
    main.tsx            # Ponto de entrada da aplicação
```

---

## Como Rodar Localmente

```bash
# Instalar dependências (na raiz do monorepo — Bun workspaces)
bun install

# Iniciar servidor de desenvolvimento (http://localhost:5173)
bun run dev

# Gerar tipos do cliente HTTP a partir do OpenAPI da API (com a API rodando em :3000)
bun run api:generate

# Formatação (Prettier)
bun run format
bun run format:check

# Análise estática (Oxlint type-aware)
bun run lint
bun run lint:fix

# Verificar tipos TypeScript
bun run typecheck

# Testes unitários e de componentes (Vitest)
bun run test
bun run test:watch
bun run test:cov

# Build de produção (gera dist/ + Service Worker e manifest.webmanifest do PWA)
bun run build

# Pré-visualizar build de produção (http://localhost:4173)
bun run preview
```

---

## Variáveis de Ambiente

Copie `.env.example` para `.env`. Nunca adicione segredos de servidor (como `SUPABASE_SERVICE_ROLE_KEY`) em variáveis `VITE_*`, pois elas são embutidas no bundle público do navegador ([docs/07-seguranca.md](../../docs/07-seguranca.md)).

| Variável | Descrição | Padrão Local |
|---|---|---|
| `VITE_API_URL` | URL base da API NestJS (em dev usa `/v1` via reverse proxy do Vite → `:3000`; em produção `https://api.seudominio.com/v1`) | `/v1` |
| `VITE_SENTRY_DSN` | DSN público do Sentry para captura de erros na UI | `""` |
