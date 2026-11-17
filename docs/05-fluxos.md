# 05 · Fluxos críticos

**Status:** Rascunho. Só documentamos o que é complexo ou arriscado. Detalhar cada fluxo **quando for implementado**.

| Fluxo | Tipo | Requisitos | Fase |
|---|---|---|---|
| Orçamento aprovado → agendamento | Sequência | RF-ORC-005, RN-007 | 1 |
| Ciclo do plano de manutenção e aviso | Sequência | RF-MAN-001…005, RN-009/010 | 1 |
| Estados do orçamento | Estado | RF-ORC-003 | 1 |
| Estados do atendimento | Estado | RF-AGE-001 | 1 |
| Convite de técnico | Sequência | RF-AUT-005 | 1 |
| Cobrança e webhook do gateway | Sequência | RF-FAT-003 | 2 |
| Estados da assinatura do SaaS | Estado | RF-PLT-003 | 2 |

## 1. Orçamento aprovado → agendamento

```mermaid
sequenceDiagram
  actor U as Usuário
  participant W as Web
  participant A as API
  participant DB as PostgreSQL
  participant Q as Fila (pg-boss)

  U->>W: Marca orçamento como "Aprovado"
  W->>A: PATCH /quotes/:id/status {APPROVED}
  A->>DB: valida transição e grava (escopo da organização)
  A-->>W: 200 orçamento aprovado
  W->>U: Oferece "Agendar atendimento"
  U->>W: Escolhe data, técnico, tipo
  W->>A: POST /quotes/:id/appointments
  A->>DB: cria appointment + appointment_items (copiados dos itens do orçamento)
  A->>Q: evento appointment.created
  A-->>W: 201 atendimento
```

## 2. Plano de manutenção e aviso

```mermaid
sequenceDiagram
  participant Cron as pg-boss (diário)
  participant J as Job maintenance.scan
  participant DB as PostgreSQL
  participant M as EmailService
  actor P as Prestador

  Cron->>J: dispara 1x/dia (por fuso da organização)
  J->>DB: planos ativos com (next_due_on − lead_days) ≤ hoje<br/>sem reminder no ciclo
  loop cada plano
    J->>DB: insere maintenance_reminder (plan_id, cycle_due_on) — único
    J->>M: envia e-mail/push ao prestador
  end
  P->>P: vê a lista "Manutenções a vencer"
  P->>DB: agenda atendimento vinculado ao plano
  Note over P,DB: Ao concluir o atendimento:<br/>last_done_on = hoje<br/>next_due_on = hoje + intervalo (RN-009)
```

## 3. Estados do orçamento

```mermaid
stateDiagram-v2
  [*] --> Pendente
  Pendente --> Aprovado: cliente aceita
  Pendente --> Rejeitado: cliente recusa
  Pendente --> Cancelado: prestador cancela
  Aprovado --> Cancelado: cancelamento
  Rejeitado --> Pendente: reabrir (nova revisão)
  Aprovado --> [*]
  Rejeitado --> [*]
  Cancelado --> [*]
```
<!-- TODO: confirmar transições permitidas e se "Expirado" (validade vencida) vira estado -->

## 4. Estados do atendimento

```mermaid
stateDiagram-v2
  [*] --> Agendado
  Agendado --> EmAndamento: técnico inicia
  Agendado --> Cancelado
  Agendado --> Agendado: reagendar
  EmAndamento --> Concluido
  EmAndamento --> Cancelado
  Concluido --> [*]
  Cancelado --> [*]
```
<!-- TODO: conferir com os estados reais do protótipo (o default era AGENDADO) -->

## 5. Convite de técnico

```mermaid
sequenceDiagram
  actor Adm as Admin
  participant A as API (Better Auth)
  participant M as EmailService
  actor T as Técnico

  Adm->>A: convidar(email, papel=técnico)
  A->>M: envia link de convite
  M-->>T: e-mail
  T->>A: abre link, cria senha (ou Google)
  A->>A: cria user + member vinculado à organização
  A-->>T: sessão iniciada
```

## 6. Cobrança e webhook (Fase 2)

<!-- TODO: preencher quando escolher o gateway. Pontos obrigatórios: validação de assinatura do webhook, idempotência por event_id, reprocessamento, reconciliação diária. -->

## 7. Estados da assinatura do SaaS (Fase 2)

```mermaid
stateDiagram-v2
  [*] --> Trial
  Trial --> Ativa: pagamento confirmado
  Trial --> Expirada: trial acabou
  Ativa --> Inadimplente: pagamento falhou
  Inadimplente --> Ativa: regularizou
  Inadimplente --> Suspensa: após N dias
  Suspensa --> Ativa: regularizou
  Ativa --> Cancelada: usuário cancela
  Suspensa --> Cancelada
  Expirada --> Ativa: assinou
```
<!-- TODO: definir N dias, e o que "suspensa" permite (somente leitura?) -->
