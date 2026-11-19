# ADR-0002 · Runtime: Node vs Bun

- **Status:** ✅ Decidida 
- **Data:** 2026-11-19

## Contexto
NestJS é desenvolvido e testado para Node. Para uma API limitada por I/O de banco, o ganho de desempenho do Bun é pequeno, e o risco se concentra nas bibliotecas críticas (Prisma, geração de PDF/XLSX, jobs, decorators com metadados).

## Opções
1. **Node em produção, Bun opcional como gerenciador de pacotes/scripts** — risco baixo.
2. **Bun também como runtime** — só se a PoC passar em todos os critérios.

## Critérios da PoC (1–2 dias)
- [✔] Nest sobe com DI/decorators e roda a suíte de testes
- [ ] Prisma: migrations, queries e pool
- [ ] Better Auth integrado, com sessão funcionando
- [ ] Geração de PDF (@react-pdf/renderer ou pdfmake) e XLSX (ExcelJS)
- [ ] pg-boss executando jobs
- [ ] Sentry e logs
- [ ] Imagem Docker e deploy no Render

Se qualquer item falhar ou exigir gambiarra, **Node**.

## Decisão
Escolha de Node 24.20.0 em produção por ser pouco ganho com bun e mais previsibilidade com node.

## Consequências
O código é o mesmo nas duas opções; migrar depois exige apenas a suíte de testes passando.
