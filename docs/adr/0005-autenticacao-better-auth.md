# ADR-0005 · Autenticação com Better Auth

- **Status:** ✅ Decidida 
- **Requisitos:** RF-AUT-001…008

## Contexto
O protótipo implementou JWT, refresh token rotativo, 2FA por e-mail, Google OAuth e aprovação manual de contas, tudo à mão. Para o SaaS, não vale manter isso.

## Decisão
**Better Auth** com o plugin **organization** (organização, membros, convites, papéis). A organização do Better Auth é o *tenant* do ADR-0003.

## Pontos a validar na PoC
- Integração com NestJS (módulo da comunidade ou adaptador próprio).
- Sessão por cookie entre subdomínios (ADR-0004).
- Papéis customizados (proprietário, administrador, técnico).
- Tabelas do Better Auth migradas pelo Prisma.

## Consequências
- Código de autenticação do protótipo é descartado.
- Dependência de uma biblioteca relativamente nova: acompanhar atualizações e fixar versões.
