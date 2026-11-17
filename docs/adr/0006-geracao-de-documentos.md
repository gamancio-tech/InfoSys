# ADR-0006 · Geração de documentos

- **Status:** Proposta
- **Requisitos:** RF-ORC-004, 008, 009 · RF-FIN-006…008

## Decisão por fase

| Necessidade | Fase | Escolha | Observação |
|---|---|---|---|
| PDF do orçamento (modelo do sistema) | 1 | `@react-pdf/renderer` ou `pdfmake` | Sem navegador; leve |
| CSV | 2 | `papaparse` / `fast-csv` | |
| Exportar Excel | 2 | `ExcelJS` | |
| Modelo Word com placeholders | 3 | `docx-templates` (verificar licença do `docxtemplater`) | |
| Word → PDF | 3 | Gotenberg (serviço Docker separado) | Não embutir LibreOffice na API |
| Preencher Excel do usuário | 3 | `ExcelJS` com mapeamento de células | Validar com planilhas reais |
| PDF arbitrário | 3+ | `pdf-lib` + editor visual (pdf.js) | Só com demanda |

## Regras
- Geração pesada roda em **worker** (pg-boss), não no processo da API.
- Arquivos gerados vão para bucket **privado**, com URL assinada e caminho por organização.
- Valores do usuário são escapados nos modelos.

## Consequências
Fase 1 não depende de LibreOffice nem Chromium, o que mantém a infraestrutura simples.
