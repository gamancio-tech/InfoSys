# 07 · Segurança e privacidade

**Status:** Rascunho. Itens marcados 🔴 devem estar prontos **antes do primeiro cliente pagante**.

## Autenticação e sessão

- Better Auth (e-mail/senha, Google). Hash de senha: padrão da biblioteca. <!-- TODO: revisar parâmetros -->
- Cookie de sessão first-party (subdomínios do mesmo domínio).
- Verificação de e-mail obrigatória antes de usar. <!-- TODO: confirmar -->
- Limite de tentativas e bloqueio temporário.

## Autorização

- Papéis por organização (RN-001). Matriz de permissões por recurso e ação em `apps/api/src/platform/auth/permissions.ts`. <!-- TODO: documentar matriz aqui quando existir -->
- Verificação em **guard** (camada HTTP) e reforço no service para operações sensíveis.

## Isolamento entre organizações 🔴

- Ver [ADR-0003](adr/0003-multi-tenancy.md) e [04](04-dados.md).
- Teste automatizado por endpoint (A não acessa B). Falha no CI bloqueia o merge.
- 404 em vez de 403 para recurso de outra organização.

## Segredos

- Nada de segredo no repositório; `.env.example` só com nomes. `gitleaks` no pré-commit e no CI. 🔴
- Variáveis de produção só nos painéis Render/Vercel/Supabase.
- Rotação planejada para: chave do banco, `SUPABASE_SERVICE_ROLE_KEY`, chave do e-mail, segredo de sessão.
- A `service_role` do Supabase **nunca** vai para o front.

## Arquivos

- Buckets privados, URL assinada, caminho prefixado por organização. 🔴
- Validar tipo real do arquivo (não só extensão). Limitar tamanho.
- Antivírus: TODO (avaliar se necessário no MVP).

## Dados sensíveis em anotações

As anotações podem guardar senhas de equipamentos dos clientes. <!-- TODO: decidir se haverá criptografia em nível de campo e aviso na UI -->

## LGPD 🔴

| Item | Situação |
|---|---|
| Papéis (controlador/operador) | Organização = controladora dos dados dos seus clientes; você = operador. Seus próprios usuários: você = controlador. **Validar com advogado.** |
| Base legal | TODO |
| Registro de tratamento (o que, por quê, quanto tempo) | TODO — tabela em [04](04-dados.md) |
| Política de privacidade e termos de uso | TODO (fora do repositório) |
| Direitos do titular (acesso, correção, exclusão, portabilidade) | RF-PLT-004 + processo manual no MVP |
| Região dos dados e transferência internacional | TODO — ver [ADR-0004](adr/0004-hospedagem-e-dominios.md) |
| Contrato com suboperadores (Supabase, Render, Resend, Sentry) | TODO |
| Plano de resposta a incidente (aviso à ANPD e aos titulares) | TODO — [09](09-operacao.md) |

## Ameaças principais (revisar a cada trimestre)

| Ameaça | Mitigação |
|---|---|
| IDOR / acesso entre organizações | Cliente Prisma com escopo, RLS, testes |
| Roubo de sessão | Cookie HttpOnly, expiração, revogação |
| Upload malicioso | Validação de tipo/tamanho, bucket privado |
| Abuso de e-mail (spam) | Limites por organização, SPF/DKIM/DMARC |
| Webhook forjado | Validação de assinatura, idempotência |
| Vazamento de segredo no repositório público | gitleaks, rotação |
| Injeção em modelos Word/PDF | Escapar valores; nunca executar conteúdo do modelo |
