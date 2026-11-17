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
  ORGANIZATION ||--o{ CUSTOMER : tem
  ORGANIZATION ||--o{ SERVICE_TYPE : configura
  ORGANIZATION ||--o{ PRODUCT : cataloga
  ORGANIZATION ||--o{ QUOTE_TEMPLATE : possui
  ORGANIZATION ||--o{ TECHNICAL : possui
  ORGANIZATION ||--o{ TECHNICAL_CHIEF : possui

  TECHNICAL_CHIEF ||--o{ SYSTEM_PLAN : possui


  CUSTOMER ||--o{ CUSTOMER_ADDRESS : "tem endereços"
  CUSTOMER ||--o{ CUSTOMER_NOTE : "tem anotações"
  CUSTOMER ||--o{ EQUIPMENT : "tem instalados"
  CUSTOMER ||--o{ APPOINTMENT : "é atendido em"
  CUSTOMER ||--o{ QUOTE : recebe
  CUSTOMER ||--o{ MAINTENANCE_PLAN : "tem planos"

  EQUIPMENT ||--o{ MAINTENANCE_PLAN : "é alvo de"
  SERVICE_TYPE ||--o{ APPOINTMENT : classifica
  SERVICE_TYPE ||--o{ MAINTENANCE_PLAN : "define serviço"

  MAINTENANCE_PLAN ||--o{ MAINTENANCE_REMINDER : gera
  MAINTENANCE_PLAN ||--o{ APPOINTMENT : "origina (opcional)"

  QUOTE ||--o{ QUOTE_ITEM : contém
  QUOTE }o--|| QUOTE_TEMPLATE : usa
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
  ORGANIZATION_TECHNICAL_CHIEF {
    uuid id PK
    uuid organization_id FK
    uuid technical_id FK
    uuid system_plan FK
    string document
    string card_hash
    timestamptz created_at
    timestamptz archived_at
  }
  SYSTEM_PLAN {
    uuid id PK
    string name
    decimal value
    int duration_in_months
    timestamptz created_at
    timestamptz updated_at
  } 
  TECHNICAL {
    uuid id PK
    uuid organization_id FK
    string name
    string phone
    string email
    string password_hash
    uuid created_by FK
    timestamptz created_at
    timestamptz updated_at
    timestamptz archived_at
  }
  CUSTOMER {
    uuid id PK
    uuid organization_id FK
    string name
    string phone
    string email
    string document
    timestamptz archived_at
  }
  CUSTOMER_ADDRESS {
    uuid id PK
    uuid customer_id FK
    string label "opcional"
    string street
    string city
    string state
    string zip
  }
  EQUIPMENT {
    uuid id PK
    uuid customer_id FK
    uuid address_id FK
    uuid note_id FK "opcional"
    string name
    string model
    string serial
    date installed_on
  }
  SERVICE_TYPE {
    uuid id PK
    uuid organization_id FK
    string name
    string color
    bool is_recurring_default
  }
  APPOINTMENT {
    uuid id PK
    uuid organization_id FK
    uuid customer_id FK
    uuid service_type_id FK
    uuid assignee_member_id FK
    uuid quote_id FK "opcional"
    uuid maintenance_plan_id FK "opcional"
    timestamptz starts_at
    timestamptz ends_at
    enum status
    decimal charged_amount
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
  }
  MAINTENANCE_REMINDER {
    uuid id PK
    uuid maintenance_plan_id FK
    date cycle_due_on
    timestamptz sent_at
    enum channel
  }
  QUOTE {
    uuid id PK
    uuid organization_id FK
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
  }
  QUOTE_ITEM {
    uuid id PK
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
  }
  note {
    uuid id PK
    uuid organization_id FK
    string title
    string content
    date created_at
    date updated_at
    date deleted_at
  }
  customer_histoy {
    uuid id PK
    uuid customer_id FK
    uuid service_type_id FK
    uuid appointment_id FK "opcional"
    uuid quote_id FK "opcional"
    uuid product_id FK "opcional"
    uuid note_id FK "opcional"
    date performed_at
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
| `observacoes` único | `customer_note` (N) | Q: anotações anexadas |
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
