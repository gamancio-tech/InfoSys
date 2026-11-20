# AGENTS.md · @infosys/web

Regras específicas para agentes de IA atuando no frontend (`apps/web`) do **InfoSys**. Para o contexto completo do produto, consulte [../../.agents/project-context.md](../../.agents/project-context.md).

## 1. Stack e Decisões Arquiteturais (ADRs)

- **Framework & Build:** React 19 + TypeScript + Vite 8 + Tailwind CSS, hospedado na **Vercel** (`app.seudominio.com` — [ADR-0004](../../docs/adr/0004-hospedagem-e-dominios.md)).
- **PWA e Estratégia Offline ([ADR-0009](../../docs/adr/0009-estrategia-offline.md), `RF-PLT-001`):**
  - No MVP, o PWA é **instalável com somente leitura em cache** (`vite-plugin-pwa`, *stale-while-revalidate* para agenda do dia e clientes recentes).
  - Exibir aviso claro `"Sem conexão: somente leitura"` quando offline.
  - **Isolamento do cache ([docs/07-seguranca.md](../../docs/07-seguranca.md), `RN-002`):** no logout e na troca de organização ativa, limpar obrigatoriamente o cache do Service Worker (`caches.delete('infosys-api-read-cache')`).
  - **Proibido** implementar escrita offline ou fila de sincronização no MVP ([ADR-0007](../../docs/adr/0007-itens-fora-do-mvp.md)).
- **Contrato de API ([ADR-0010](../../docs/adr/0010-dados-e-contrato-da-api.md), [docs/06-api.md](../../docs/06-api.md)):**
  - O cliente HTTP e os tipos da API são **gerados automaticamente** a partir do OpenAPI do backend (`bun run api:generate`).
  - **Proibido** escrever interfaces de resposta/payload da API manualmente no frontend.
- **Autenticação e Sessão ([ADR-0004](../../docs/adr/0004-hospedagem-e-dominios.md), [ADR-0005](../../docs/adr/0005-autenticacao-better-auth.md)):**
  - Sessão gerenciada por cookie `HttpOnly; Secure; SameSite=Lax` no domínio `.seudominio.com` (`credentials: 'include'`).
  - O `organizationId` ativo vem sempre da sessão no backend — o frontend nunca envia `organizationId` como parâmetro de filtro para isolar dados.

## 2. Estrutura de Pastas ([docs/03-arquitetura.md](../../docs/03-arquitetura.md))

```text
src/
  features/   # Espelha os módulos de domínio da API (customers, appointments,
              # maintenance, quotes, catalog, inventory, finance, invoices, notes)
  shared/     # Componentes de UI reutilizáveis, hooks, utilitários e api-client gerado
  app/        # Rotas, providers globais e registro do Service Worker (PWA)
```

- Path aliases configurados no Vite e TypeScript: `@/*`, `@app/*`, `@features/*`, `@shared/*`.
- Features não devem acoplar estado interno umas das outras; código transversal vive em `@shared/*`.

## 3. Convenções de UI, Dados, Segurança e Testes

- **Mobile-First para Uso em Campo (`RNF-007`, `RNF-008`):**
  - Todas as telas principais (agenda, clientes, orçamentos, manutenções) devem ser 100% utilizáveis em **`360px` de largura**, com contraste e navegação por teclado adequados (**WCAG AA**).
- **Dinheiro e Datas (`RN-011`, `RN-012`, [docs/06-api.md](../../docs/06-api.md)):**
  - Valores monetários chegam da API como **string decimal** (`"1234.50"`), nunca `number` float; formatar para `BRL` (`R$`) na camada de exibição.
  - Datas chegam em ISO 8601 UTC e devem ser exibidas no fuso horário da organização.
- **Segurança ([docs/07-seguranca.md](../../docs/07-seguranca.md)):**
  - Variáveis `VITE_*` são públicas no bundle do navegador. **Jamais** coloque segredos ou `SUPABASE_SERVICE_ROLE_KEY` em arquivos `.env` do frontend.
  - Uploads e downloads de arquivos usam exclusivamente **URLs assinadas de curta duração** emitidas pela API.
- **Testes ([docs/08-testes.md](../../docs/08-testes.md)):**
  - Testes unitários/componentes com **Vitest** e fluxos E2E com **Playwright**, sempre referenciando os IDs de requisitos (`RF-*`, `RN-*`) nos blocos `describe`/`it`.

