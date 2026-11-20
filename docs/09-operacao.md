# 09 · Operação

**Status:** Rascunho. Partes de produção sensíveis (endereços internos, credenciais, detalhes de infraestrutura) ficam **fora** do repositório público.

## Ambientes

| Ambiente | Web | API | Banco | Uso |
|---|---|---|---|---|
| Local | `localhost:5173` | `localhost:3000` | Postgres no Docker | Desenvolvimento |
| Staging | TODO | TODO | Projeto Supabase separado | Testes antes do deploy |
| Produção | `app.seudominio.com` | `api.seudominio.com` | Supabase (região: TODO) | Clientes |

> Planos gratuitos hibernam ou restringem uso comercial. **Não use em produção.** Custo mensal estimado: TODO.

## Variáveis de ambiente (`.env.example`)

| Variável | Onde | Descrição |
|---|---|---|
| `NODE_ENV` / `PORT` | API | Ambiente (`development`, `test`, `production`) e porta HTTP (`3000`) |
| `DATABASE_URL` | API | Conexão pelo **pooler** (aplicação) |
| `DIRECT_URL` | API | Conexão **direta** (migrations e pg-boss) |
| `BETTER_AUTH_SECRET` | API | Segredo de sessão (≥ 32 caracteres) |
| `BETTER_AUTH_URL` | API | URL pública da API |
| `WEB_ORIGIN` | API | Origem permitida (CORS/cookies) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | API | Credenciais OAuth para login com Google (`RF-AUT-002`) |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | API | Storage (só no servidor) |
| `RESEND_API_KEY` / `MAIL_FROM` | API | E-mail |
| `SENTRY_DSN` | API/Web | Erros |
| `VITE_API_URL` | Web | URL da API |

Nunca commitar valores reais.

## Deploy

<!-- TODO: preencher após a PoC. Pontos: imagem Docker da API, release command das migrations (prisma migrate deploy), health check, rollback. -->

- **Migrations:** executadas com `DIRECT_URL` antes de subir a nova versão. Alterações destrutivas em duas etapas (expandir → migrar → contrair).

## Backup e restauração 🔴

- Backups automáticos do Supabase **mais** um dump lógico semanal para um bucket de outro provedor. <!-- TODO: confirmar o que o plano contratado oferece -->
- **Teste de restauração** trimestral, registrado aqui com data e resultado.
- Metas: RPO ≤ 24 h, RTO ≤ 4 h (RNF-006).

## Observabilidade

- Sentry (erros) com `organizationId` e `requestId`.
- Logs estruturados (JSON). Sem dados pessoais nos logs.
- Monitor externo de disponibilidade em `/health`. Alertas por e-mail/push para você.

## SLOs

| SLO | Meta | Medição |
|---|---|---|
| Disponibilidade | 99,5% mensal | Monitor externo |
| Latência p95 API | < 500 ms | Logs/APM |
| Entrega de avisos de manutenção | 99% no dia previsto | Métrica do job |

## Runbook de incidentes (esqueleto)

| Sintoma | Onde olhar | Ação |
|---|---|---|
| API fora | Render (logs), `/health` | Rollback para o deploy anterior |
| Erros de conexão com o banco | Supabase (conexões), pooler | Reduzir pool, reiniciar |
| E-mails não chegam | Painel do provedor, DMARC | Verificar domínio e fila |
| Avisos não disparam | Fila `maintenance`, logs do worker | Reexecutar `maintenance.scan` (idempotente) |
| Suspeita de vazamento | — | Revogar sessões, rotacionar segredos, avaliar aviso à ANPD |

## E-mail

- Configurar SPF, DKIM e DMARC no domínio. Provedor atrás da interface `EmailService`.
