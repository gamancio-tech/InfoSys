# ADR-0001 · Licença e modelo de negócio

- **Status:** ⏳ Pendente
- **Data:** 2026-11-13
- **Requisitos relacionados:** RNF-010

## Contexto
O produto será vendido como SaaS. O repositório será público para portfólio, **sem permitir** que clientes ou concorrentes usem o código. Isso **não é open source** pela definição da OSI (que exige uso, modificação e redistribuição livres, inclusive comercial); é *source-available*. O texto público deve dizer isso com precisão.

## Opções consideradas
1. **Repositório público + licença source-available** (PolyForm Shield, PolyForm Noncommercial ou BSL) — mostra o código, restringe competição ou uso comercial.
2. **Repositório privado** + convite a quem avalia — controle total, menos visibilidade.
3. **Híbrido:** documentação pública (README, C4, ADRs, modelo de dados) e código privado ou sob demanda.

## Decisão
TODO. <!-- Sugestão inicial: opção 3 ou 1, validada com advogado. -->

## Consequências
- Uma licença só impede quem a respeita; o diferencial real é operação, produto e suporte.
- Código público é superfície de ataque visível: exige `gitleaks`, `.env.example` limpo e nenhuma vulnerabilidade conhecida aberta.
- Sem aceitar contribuições: não há `CONTRIBUTING`, issue templates nem docs de self-hosting.
- O README deve dizer "código para consulta; uso e hospedagem não permitidos".

> Não sou advogado; valide a licença escolhida com um profissional.
