# 04 · Dados

**Status:** Rascunho — modelo conceitual do MVP. O schema Prisma é a fonte de verdade; este documento explica as decisões.

## Convenções

| Tema | Convenção | Motivo |
|---|---|---|
| Chave primária | `uuid` (v7 se possível) | Evita enumeração de IDs entre organizações |
| Tenant | Toda tabela de domínio tem `organization_id NOT NULL` + índice | RN-002 |
| Dinheiro | `Decimal(14,2)` | RN-011; o protótipo usava `Float` |
| Datas | `timestamptz` em UTC; fuso na organização | RN-012; o protótipo usava `String` |
| Enums | Enum do banco para estados fixos; tabela para tipos configuráveis | Tipos de atendimento variam por organização |
| Exclusão | `archived_at` (soft delete) onde houver histórico | RN-014 |
| Auditoria | `created_at`, `updated_at`, `created_by` | Rastreio |
| Nomes | Tabelas e colunas em inglês, `snake_case` (mapeadas no Prisma) | Padrão da comunidade |

> O Better Auth gerencia suas próprias tabelas (`user`, `session`, `account`, `organization`, `member`, `invitation`). Elas não aparecem no diagrama abaixo, exceto `organization`.

## Modelo conceitual (MVP)

```mermaid
erDiagram
  ORGANIZATION ||--o{ ORGANIZATION_ADDRESS : "tem endereços"
  ORGANIZATION ||--o{ CUSTOMER : tem
  ORGANIZATION ||--o{ SERVICE_TYPE : configura
  ORGANIZATION ||--o{ PRODUCT_TYPE : classifica
  ORGANIZATION ||--o{ SUPPLIER : cadastra
  ORGANIZATION ||--o{ PRODUCT : cataloga
  ORGANIZATION ||--o{ QUOTE_TEMPLATE : possui
  ORGANIZATION ||--o{ NOTE : registra

  CUSTOMER ||--o{ CUSTOMER_ADDRESS : "tem endereços"
  CUSTOMER ||--o{ NOTE : "tem anotações (opcional)"
  CUSTOMER ||--o{ EQUIPMENT : "tem instalados"
  CUSTOMER ||--o{ APPOINTMENT : "é atendido em"
  CUSTOMER ||--o{ QUOTE : recebe
  CUSTOMER ||--o{ MAINTENANCE_PLAN : "tem planos"
  CUSTOMER ||--o{ CUSTOMER_HISTORY : "possui histórico"

  CUSTOMER_ADDRESS ||--o{ EQUIPMENT : localiza
  EQUIPMENT ||--o{ MAINTENANCE_PLAN : "é alvo de (opcional)"
  SERVICE_TYPE ||--o{ APPOINTMENT : classifica
  SERVICE_TYPE ||--o{ MAINTENANCE_PLAN : "define serviço"

  MAINTENANCE_PLAN ||--o{ MAINTENANCE_REMINDER : gera
  MAINTENANCE_PLAN ||--o{ APPOINTMENT : "origina (opcional)"

  PRODUCT_TYPE ||--o{ PRODUCT : categoriza
  SUPPLIER ||--o{ PRODUCT : "fornece (opcional)"

  QUOTE ||--o{ QUOTE_ITEM : contém
  QUOTE }o--o| QUOTE_TEMPLATE : usa
  QUOTE ||--o{ APPOINTMENT : "converte em (opcional)"
  PRODUCT ||--o{ QUOTE_ITEM : "referenciado por (opcional)"

  APPOINTMENT ||--o{ APPOINTMENT_ITEM : "usa materiais"
  PRODUCT ||--o{ APPOINTMENT_ITEM : "referenciado por (opcional)"

  ORGANIZATION {
    uuid id PK
    string name
    string document
    string phone
    string email
    string timezone
    timestamptz created_at
    timestamptz updated_at
    timestamptz archived_at
  }
  ORGANIZATION_ADDRESS {
    uuid id PK
    uuid organization_id FK
    string label "opcional"
    string street
    string city
    string state
    string zip
  }
  CUSTOMER {
    uuid id PK
    uuid organization_id FK
    string name
    string phone
    string email
    string document
    uuid created_by FK
    timestamptz created_at
    timestamptz updated_at
    timestamptz archived_at
  }
  CUSTOMER_ADDRESS {
    uuid id PK
    uuid organization_id FK
    uuid customer_id FK
    string label "opcional"
    string street
    string city
    string state
    string zip
  }
  EQUIPMENT {
    uuid id PK
    uuid organization_id FK
    uuid customer_id FK
    uuid address_id FK
    uuid note_id FK "opcional"
    string name
    string model
    string serial
    date installed_on
    timestamptz created_at
    timestamptz updated_at
    timestamptz archived_at
  }
  SERVICE_TYPE {
    uuid id PK
    uuid organization_id FK
    string name
    string color
    bool is_recurring_default
    timestamptz archived_at
  }
  APPOINTMENT {
    uuid id PK
    uuid organization_id FK
    uuid customer_id FK
    uuid service_type_id FK
    uuid assignee_member_id FK "member (Better Auth)"
    uuid quote_id FK "opcional"
    uuid maintenance_plan_id FK "opcional"
    timestamptz starts_at
    timestamptz ends_at
    enum status
    decimal charged_amount
    uuid created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  APPOINTMENT_ITEM {
    uuid id PK
    uuid organization_id FK
    uuid appointment_id FK
    uuid product_id FK "opcional"
    string name
    decimal quantity
    decimal unit_price
  }
  MAINTENANCE_PLAN {
    uuid id PK
    uuid organization_id FK
    uuid customer_id FK
    uuid equipment_id FK "opcional"
    uuid service_type_id FK
    int interval_value
    enum interval_unit "day|month|year"
    int lead_days
    date last_done_on
    date next_due_on
    bool active
    timestamptz created_at
    timestamptz updated_at
    timestamptz archived_at
  }
  MAINTENANCE_REMINDER {
    uuid id PK
    uuid organization_id FK
    uuid maintenance_plan_id FK
    date cycle_due_on
    timestamptz sent_at
    enum channel
  }
  QUOTE_TEMPLATE {
    uuid id PK
    uuid organization_id FK
    string name
    jsonb config "logo, cores, textos, PIX"
    bool is_default
    timestamptz created_at
    timestamptz updated_at
  }
  QUOTE {
    uuid id PK
    uuid organization_id FK
    uuid customer_id FK
    uuid template_id FK "opcional"
    string number "único por org/ano"
    int revision
    enum status
    jsonb customer_snapshot
    decimal subtotal
    decimal discount
    decimal surcharge
    decimal labor
    decimal total
    date valid_until
    uuid created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  QUOTE_ITEM {
    uuid id PK
    uuid organization_id FK
    uuid quote_id FK
    uuid product_id FK "opcional"
    string name
    decimal quantity
    decimal unit_price
    bool is_adhoc
  }
  PRODUCT {
    uuid id PK
    uuid organization_id FK
    uuid product_type_id FK
    uuid supplier_id FK "opcional"
    string name
    string description
    decimal purchase_price
    decimal selling_price
    timestamptz created_at
    timestamptz updated_at
    timestamptz archived_at
  }
  PRODUCT_TYPE {
    uuid id PK
    uuid organization_id FK
    string name
    string description
    decimal gain_percent
  }
  SUPPLIER {
    uuid id PK
    uuid organization_id FK
    string name
    string description
    decimal gain_percent "opcional"
    timestamptz archived_at
  }
  NOTE {
    uuid id PK
    uuid organization_id FK
    uuid customer_id FK "opcional (RF-CLI-003 / RF-NOT-001)"
    string title
    string content
    uuid created_by FK
    timestamptz created_at
    timestamptz updated_at
    timestamptz archived_at
  }
  CUSTOMER_HISTORY {
    uuid id PK
    uuid organization_id FK
    uuid customer_id FK
    uuid service_type_id FK "opcional"
    uuid appointment_id FK "opcional"
    uuid quote_id FK "opcional"
    uuid product_id FK "opcional"
    uuid note_id FK "opcional"
    timestamptz performed_at
    decimal charged_amount
  }
```

## Multi-tenancy

Resumo (detalhes e alternativas em [ADR-0003](adr/0003-multi-tenancy.md)):

- Banco único, `organization_id` em toda tabela de domínio.
- Um **cliente Prisma com escopo** injeta o filtro da organização do usuário autenticado; o código de módulo não monta esse filtro manualmente.
- Defesa em profundidade: RLS no Postgres com `SET LOCAL app.organization_id` por transação. <!-- TODO: validar com o pooler do Supabase na PoC -->
- Teste obrigatório no CI: usuário da organização A não lê nem altera nada da organização B em **cada** endpoint.

## Mudanças em relação ao protótipo

| Protótipo | Novo | Por quê |
|---|---|---|
| `Float` para valores | `Decimal` | Arredondamento |
| `data`/`horaInicio` como texto | `starts_at`/`ends_at` `timestamptz` | Ordenação, recorrência, fuso |
| `tipo`/`status` texto livre | Enum + `service_type` configurável | Domínio genérico |
| Cliente com um `endereco` texto | `customer_address` (N) | Q: múltiplos endereços |
| Sem equipamentos | `equipment` | Q: equipamentos instalados |
| `observacoes` único | `note` (N, com `customer_id` opcional) | Q: anotações anexadas ao cliente ou gerais |
| Sem recorrência | `maintenance_plan` + `maintenance_reminder` | Diferencial |
| `Budget.numero @unique` global | Único por `organization_id` + ano | Multi-tenant |
| `clienteNome/Telefone/Endereco` no agendamento | Só `customer_id` | Evitar duplicação; snapshot fica só no orçamento |
| `Product.id` = ID do fornecedor | `product.id` próprio; `supplier_product` à parte (Fase 3) | Desacoplar |

## Dicionário de dados

<!-- TODO: gerar a partir do schema.prisma quando existir (ex.: prisma-markdown ou prisma-dbml-generator) e anexar aqui. Não escrever à mão. -->

## Retenção e dados pessoais

| Dado | Pessoal? | Retenção | Observação |
|---|---|---|---|
| Cliente (nome, telefone, e-mail, documento, endereço) | Sim | Enquanto a organização existir; apagar a pedido | Você é **operador**; a organização é a controladora <!-- TODO: validar com advogado --> |
| Anotações (podem conter senhas) | Potencialmente sensível | Idem | Considerar criptografia em nível de campo |
| Anexos | Possível | Idem | Bucket privado, URL assinada |
