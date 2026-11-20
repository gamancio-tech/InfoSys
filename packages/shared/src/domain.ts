/**
 * Papéis de membro dentro de uma organização (RN-001, ADR-0005).
 */
export const MEMBER_ROLES = ['owner', 'admin', 'technician'] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

/**
 * Estados do orçamento (RF-ORC-003, docs/05-fluxos.md).
 */
export const QUOTE_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELED'] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

/**
 * Estados do atendimento/agendamento (RF-AGE-001, docs/05-fluxos.md).
 */
export const APPOINTMENT_STATUSES = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

/**
 * Unidades de periodicidade de um plano de manutenção recorrente (RF-MAN-001, docs/04-dados.md).
 */
export const MAINTENANCE_INTERVAL_UNITS = ['day', 'month', 'year'] as const;
export type MaintenanceIntervalUnit = (typeof MAINTENANCE_INTERVAL_UNITS)[number];

/**
 * Prefixo padrão da API HTTP (docs/06-api.md).
 */
export const API_PREFIX = 'v1' as const;
