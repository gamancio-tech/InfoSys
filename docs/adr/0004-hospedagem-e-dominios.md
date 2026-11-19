# ADR-0004 · Hospedagem, domínios e região

- **Status:** ✅ Decidida 
- **Requisitos:** RNF-003, RNF-005, RNF-010

## Contexto
Front na Vercel, API no Render, banco e storage no Supabase. Domínios diferentes quebram cookies de sessão (bloqueio de cookies de terceiros no Safari/iOS, que afeta PWA).

## Decisões
1. **Mesmo domínio raiz:** `app.seudominio.com` (Vercel) e `api.seudominio.com` (Render). Cookie com `Domain=.seudominio.com`.
2. **Região:** API e banco na **mesma região**, mesmo que fora do Brasil, para não somar latência em cada query. <!-- TODO: conferir regiões atuais do Render e do Supabase (São Paulo?) -->
3. **Conexão com o banco:** pooler (transação) para a aplicação; conexão **direta** para migrations e pg-boss.
4. **Sem plano gratuito em produção** (hibernação no Render; plano Hobby da Vercel não comercial, a confirmar).

## Consequências
- Dados armazenados fora do Brasil exigem análise de transferência internacional (LGPD) — ver [07](../07-seguranca.md).
- Custo mensal mínimo entra no planejamento: TODO.
- Se o Render não tiver região próxima ao banco, avaliar alternativa (ex.: VPS ou provedor com região no Brasil).
