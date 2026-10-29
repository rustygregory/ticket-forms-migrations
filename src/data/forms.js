/**
 * Prototype ticket / service catalog forms.
 * `brand`: 'dinoco' | 'rusteze' | null (null = ticket forms without brands)
 * `conditions`: { agents, endUsers } — form condition cards per audience
 */

/** Empty conditions shape for forms without seeded rules. */
export const EMPTY_CONDITIONS = { agents: [], endUsers: [] }

/** Demo agent conditions (Approval status + Sentiment confidence). */
const DEMO_AGENT_CONDITIONS = [
  {
    id: 'cond-approval',
    fieldName: 'Approval status',
    expanded: true,
    rules: [
      {
        id: 'rule-approval-pending',
        ifValue: 'Pending',
        thenShow: ['Language', 'Sentiment', 'Sentiment confidence'],
      },
    ],
  },
  {
    id: 'cond-sentiment-confidence',
    fieldName: 'Sentiment confidence',
    expanded: false,
    rules: [
      {
        id: 'rule-sentiment-medium',
        ifValue: 'Medium',
        thenShow: ['Language'],
      },
    ],
  },
]

export const INITIAL_FORMS = [
  {
    id: 'common',
    name: 'Common ticket form',
    endUserTitle: 'Common ticket form',
    badges: [],
    active: true,
    type: 'ticket',
    brand: null,
    editableForEndUsers: true,
    applyToAllBrands: true,
    conditions: {
      agents: DEMO_AGENT_CONDITIONS,
      endUsers: [],
    },
  },
  {
    id: 'default',
    name: 'Default Ticket Form',
    endUserTitle: 'Default Ticket Form',
    badges: ['Default'],
    active: true,
    type: 'ticket',
    brand: 'dinoco',
    editableForEndUsers: true,
    applyToAllBrands: false,
    conditions: { agents: [], endUsers: [] },
  },
  {
    id: 'ice-cream',
    name: 'ice cream form',
    endUserTitle: 'ice cream form',
    badges: [],
    active: true,
    type: 'ticket',
    brand: 'rusteze',
    editableForEndUsers: true,
    applyToAllBrands: false,
    conditions: { agents: [], endUsers: [] },
  },
  {
    id: 'new',
    name: 'New form',
    endUserTitle: '',
    badges: ['Agent only'],
    active: true,
    type: 'ticket',
    brand: null,
    editableForEndUsers: false,
    applyToAllBrands: true,
    conditions: { agents: [], endUsers: [] },
  },
  {
    id: 'copy-common',
    name: 'Copy of Common ticket form',
    endUserTitle: 'Copy of Common ticket form',
    badges: [],
    active: false,
    type: 'ticket',
    brand: 'dinoco',
    editableForEndUsers: true,
    applyToAllBrands: false,
    conditions: { agents: [], endUsers: [] },
  },
  {
    id: 'service-catalog-1',
    name: 'Hardware request',
    endUserTitle: 'Hardware request',
    badges: [],
    active: true,
    type: 'service',
    brand: 'rusteze',
    editableForEndUsers: true,
    applyToAllBrands: false,
    conditions: { agents: [], endUsers: [] },
  },
  {
    id: 'service-catalog-2',
    name: 'Access request',
    endUserTitle: 'Access request',
    badges: ['Default'],
    active: true,
    type: 'service',
    brand: null,
    editableForEndUsers: true,
    applyToAllBrands: true,
    conditions: { agents: [], endUsers: [] },
  },
  {
    id: 'service-catalog-3',
    name: 'Software license',
    endUserTitle: 'Software license',
    badges: [],
    active: false,
    type: 'service',
    brand: 'dinoco',
    editableForEndUsers: true,
    applyToAllBrands: false,
    conditions: { agents: [], endUsers: [] },
  },
]

/** Locked system fields always present on a ticket form. */
export const SYSTEM_FIELDS = [
  { id: 'subject', name: 'Subject', kind: 'text', system: true },
  { id: 'description', name: 'Description', kind: 'textarea', system: true },
]

/**
 * Default selected fields for the form builder (matches edit-form screenshot).
 * Subject + Description are system; the rest are removable.
 */
export const DEFAULT_FORM_FIELDS = [
  ...SYSTEM_FIELDS,
  { id: 'approval-status', name: 'Approval status', kind: 'dropdown', system: false },
  { id: 'language', name: 'Language', kind: 'dropdown', system: false },
  { id: 'sentiment', name: 'Sentiment', kind: 'dropdown', system: false },
  { id: 'sentiment-confidence', name: 'Sentiment confidence', kind: 'dropdown', system: false },
]

/** All ticket fields that can appear on a form (available panel filters out selected). */
export const AVAILABLE_FIELDS = [
  { id: 'approval-status', name: 'Approval status', kind: 'dropdown' },
  { id: 'channel-group', name: 'Channel group', kind: 'dropdown' },
  { id: 'entity-test', name: 'Entity test', kind: 'text' },
  { id: 'language', name: 'Language', kind: 'dropdown' },
  { id: 'language-confidence', name: 'Language confidence', kind: 'dropdown' },
  { id: 'multi-recipient', name: 'Multi-recipient email ID', kind: 'text' },
  { id: 'pause-messaging-reminders', name: 'Pause messaging reminders', kind: 'boolean' },
  { id: 'priority', name: 'Priority', kind: 'dropdown' },
  { id: 'required-tasks', name: 'Required tasks', kind: 'dropdown' },
  { id: 'resolution-tier', name: 'Resolution tier', kind: 'dropdown' },
  { id: 'resolution-type', name: 'Resolution type', kind: 'dropdown' },
  { id: 'sentiment', name: 'Sentiment', kind: 'dropdown' },
  { id: 'sentiment-confidence', name: 'Sentiment confidence', kind: 'dropdown' },
  { id: 'summary', name: 'Summary', kind: 'text' },
  { id: 'summary-agent-id', name: 'Summary agent ID', kind: 'text' },
  { id: 'summary-date-time', name: 'Summary date and time', kind: 'text' },
  { id: 'summary-locale', name: 'Summary locale', kind: 'text' },
  { id: 'topic', name: 'Topic', kind: 'dropdown' },
  { id: 'topic-confidence', name: 'Topic confidence', kind: 'dropdown' },
  { id: 'type', name: 'Type', kind: 'dropdown' },
]

/**
 * Parent fields for “When filling out this field” on Default Ticket Form (empty).
 * Order matches product screenshots — connections TBD.
 */
export const DEFAULT_CONDITION_PARENT_FIELDS = [
  { id: 'type', name: 'Type', kind: 'dropdown' },
  { id: 'priority', name: 'Priority', kind: 'dropdown' },
  { id: 'summary', name: 'Summary', kind: 'text' },
  { id: 'summary-agent-id', name: 'Summary agent ID', kind: 'text' },
  { id: 'summary-date-time', name: 'Summary date and time', kind: 'text' },
  { id: 'summary-locale', name: 'Summary locale', kind: 'text' },
  { id: 'topic', name: 'Topic', kind: 'dropdown' },
  { id: 'topic-confidence', name: 'Topic confidence', kind: 'dropdown' },
  { id: 'language', name: 'Language', kind: 'dropdown' },
  { id: 'language-confidence', name: 'Language confidence', kind: 'dropdown' },
  { id: 'sentiment', name: 'Sentiment', kind: 'dropdown' },
  { id: 'sentiment-confidence', name: 'Sentiment confidence', kind: 'dropdown' },
  { id: 'entity-test', name: 'Entity test', kind: 'text' },
]

/**
 * Parent fields when the form already has conditions seeded (Common ticket form).
 * Order matches product screenshot — connections TBD.
 */
export const COMMON_CONDITION_PARENT_FIELDS = [
  { id: 'approval-status', name: 'Approval status', kind: 'dropdown' },
  { id: 'language', name: 'Language', kind: 'dropdown' },
  { id: 'sentiment', name: 'Sentiment', kind: 'dropdown' },
  { id: 'sentiment-confidence', name: 'Sentiment confidence', kind: 'dropdown' },
]

/** Resolve condition parent-field options for a form (connections TBD). */
export function getConditionParentFields(form) {
  if (form?.id === 'common') return COMMON_CONDITION_PARENT_FIELDS
  return DEFAULT_CONDITION_PARENT_FIELDS
}

export const BRAND_OPTIONS = [
  { value: 'none', label: 'Ticket forms without brands' },
  { value: 'dinoco', label: 'Dinoco' },
  { value: 'rusteze', label: 'Rusteze' },
]

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export function brandLabel(value) {
  return BRAND_OPTIONS.find(o => o.value === value)?.label ?? value
}

export function statusLabel(value) {
  return STATUS_OPTIONS.find(o => o.value === value)?.label ?? value
}
