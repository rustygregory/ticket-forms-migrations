import { useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, IconButton } from '@zendeskgarden/react-buttons'
import {
  Combobox,
  Field as ComboboxField,
  Item,
  Label as ComboboxLabel,
  Menu,
  Option,
} from '@zendeskgarden/react-dropdowns'
import { Checkbox, Field, Label, Hint, Input, MediaInput } from '@zendeskgarden/react-forms'
import { Modal } from '@zendeskgarden/react-modals'
import { Tag } from '@zendeskgarden/react-tags'
import { getColor } from '@zendeskgarden/react-theming'
import { XXL } from '@zendeskgarden/react-typography'
import Breadcrumbs from './Breadcrumbs.v3'
import { AVAILABLE_FIELDS, DEFAULT_FORM_FIELDS } from '../data/forms'
import {
  ChevronDownIcon,
  FieldTypeIcon,
  GripIcon,
  LockIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from './icons'
import { useSuccessToast } from '../hooks/useSuccessToast'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`

const Container = styled.div`
  padding: 12px 40px 24px;
  overflow-y: auto;
  flex: 1;
  box-sizing: border-box;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 32px; /* page title → page content */
`

/* Actions + chevron — 8px between label and EndIcon */
const ActionsButton = styled(Button)`
  && {
    gap: 8px;
  }

  && > svg,
  && [data-garden-id='buttons.icon'] {
    margin-inline-start: 0; /* gap owns the 8px spacing */
  }
`

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`

const Title = styled(XXL).attrs({ 'data-inspect-token-color': 'fg/default' })`
  margin: 0;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
`

/* Status pill beside page title — shared size; hue/colors differ Active vs Inactive */
const StatusTag = styled(Tag)`
  && {
    min-height: 20px;
    font-size: 12px;
    line-height: 16px;
  }

  && > span {
    font-size: 12px;
    line-height: 16px;
  }
`

/* Active — Flora semantic tag/bg/mint + tag/fg/mint */
const ActiveTag = styled(StatusTag).attrs({
  'data-inspect-name': 'Tag',
  'data-inspect-token-bg': 'tag/bg/mint',
  'data-inspect-token-color': 'tag/fg/mint',
})`
  && {
    background-color: ${p => getColor({ theme: p.theme, variable: 'tag.bg.mint' })};
    color: ${p => getColor({ theme: p.theme, variable: 'tag.fg.mint' })};
  }
`

const SettingsField = styled.div`
  width: 400px;
  max-width: 100%;
`

/* Align with Editable-for-end-users label text (Garden checkbox label padding-inline-start: 24px) */
const NestedSettingsField = styled(SettingsField)`
  margin-inline-start: 24px;
`

/* Checkbox + nested end-user title — 12px between them */
const EndUserSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

/* Form settings sit above the builder — not side-by-side with Available fields */
const Settings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 630px;
  margin-bottom: 32px;
`

const BrandsBlock = styled.div`
  display: flex;
  flex-direction: column;
`

/* Row 1: Ticket fields label (left only). Row 2: field list + Available panel aligned. */
const Builder = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(412px, 412px);
  grid-template-rows: auto auto;
  column-gap: 24px;
  row-gap: 8px;
  align-items: start;
`

const FieldsLabel = styled.div`
  grid-column: 1;
  grid-row: 1;
`

const FormColumn = styled.div`
  grid-column: 1;
  grid-row: 2;
  min-width: 0;
`

const FieldList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 120px;
`

const FieldRow = styled.li.attrs({
  'data-inspect-token-bg': 'bg/default',
  'data-inspect-token-border': 'border/default',
})`
  display: flex;
  align-items: center;
  padding: 12px;
  padding-inline-end: 0; /* end inset comes from RowAction margin-inline-end */
  border: 1px solid ${p => getColor({ theme: p.theme, variable: 'border.default' })};
  border-radius: 8px;
  background: ${p => getColor({ theme: p.theme, variable: 'background.default' })};
  box-shadow: ${p =>
    p.$dragging
      ? `0 4px 12px ${getColor({
          theme: p.theme,
          variable: 'foreground.default',
          transparency: 0.12,
        })}`
      : 'none'};

  /* List row hover — bg/primaryEmphasis @ opacity 100 */
  &:hover {
    background: ${p =>
      getColor({
        theme: p.theme,
        variable: 'background.primaryEmphasis',
        transparency: p.theme.opacity[100],
      })};
  }
`

const Grip = styled.button.attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  cursor: grab;
  padding: 0;
  margin-inline-end: 12px;
  touch-action: none;
  flex-shrink: 0;

  &:active {
    cursor: grabbing;
  }

  svg {
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
    pointer-events: none;
  }
`

/* Field-type icon (T / multiline / checkbox) — FG/subtle; 24px before FieldMeta content */
const IconWrap = styled.span.attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  display: inline-flex;
  flex-shrink: 0;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  margin-inline-end: 24px;

  svg {
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  }
`

/* Row action (remove / lock) — 32×32 hit box, 16px icon centered, 24px to row edge */
const RowAction = styled.span.attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin-inline-end: 24px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};

  /* IconButton fills the 32px box; keep FG/subtle */
  && [data-garden-id='buttons.icon_button'],
  && button {
    width: 32px;
    height: 32px;
    min-width: 32px;
    padding: 0;
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  }

  /* Beat Garden IconButton svg sizing (often 20px) so lock + X both read as 16×16 */
  && svg {
    width: 16px !important;
    height: 16px !important;
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  }
`

const FieldMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

/* Flora Typography Medium / Semibold — fontSizes.md + lineHeights.md + fontWeights.semibold */
const FieldName = styled.span.attrs({ 'data-inspect-token-color': 'fg/default' })`
  font-size: 14px;
  line-height: 20px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
  font-weight: 600;
`

/* Flora Typography Medium / Regular — FG/subtle */
const FieldHint = styled.span.attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  font-size: 14px;
  line-height: 20px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  font-weight: 400;
`

const Spacer = styled.span`
  flex: 1;
`

const Panel = styled.aside.attrs({
  'data-inspect-token-bg': 'bg/subtle',
  'data-inspect-token-border': 'border/default',
})`
  grid-column: 2;
  grid-row: 2; /* Align with Subject / ticket field list, not Ticket fields label */
  min-width: 412px;
  width: 412px;
  border: 1px solid ${p => getColor({ theme: p.theme, variable: 'border.default' })};
  border-radius: 12px;
  padding: 16px;
  background: ${p => getColor({ theme: p.theme, variable: 'background.subtle' })};
  box-sizing: border-box;
`

/* Flora Typography Medium / Semibold — 14/20 */
const PanelTitle = styled.h2.attrs({ 'data-inspect-token-color': 'fg/default' })`
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
  margin: 0;
`

/* Flora Typography Medium / Regular — 14/20 */
const PanelHint = styled.p.attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  margin: 0 0 16px;
`

const PanelControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;

  /* Flora search media: FG/subtle icon (match FormsList), no hint under field */
  [data-garden-id='forms.faux_input'] {
    align-items: center;
    box-sizing: border-box;
    height: 42px;
    padding: 10px 12px;
    background-color: ${p => getColor({ theme: p.theme, variable: 'background.default' })};
  }

  [data-garden-id='forms.faux_input'] > svg {
    width: 16px !important;
    height: 16px !important;
    margin: 0 8px 0 0 !important;
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })} !important;
    flex-shrink: 0;
  }
`

const SortField = styled.div`
  /* Flora Combobox — select-only sort */
  [data-garden-id='dropdowns.combobox'] {
    background-color: ${p => getColor({ theme: p.theme, variable: 'background.default' })};
  }
`

const AvailableList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const AvailableItem = styled.button.attrs({
  'data-inspect-token-bg': 'bg/default',
  'data-inspect-token-border': 'border/subtle',
  'data-inspect-token-color': 'fg/default',
})`
  display: flex;
  align-items: center;
  gap: 0; /* type→name gap via IconWrap margin-inline-end: 24px */
  width: 100%;
  padding: 10px 0 10px 12px;
  border: 1px solid ${p => getColor({ theme: p.theme, variable: 'border.subtle' })};
  border-radius: 8px;
  background: ${p => getColor({ theme: p.theme, variable: 'background.default' })};
  /* Add-only rows — not reorderable; override any dnd-kit grab/move cursor */
  cursor: pointer !important;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
  font-size: 14px;
  line-height: 20px;
  font-weight: 600; /* Medium / Semibold — match FieldName */
  text-align: left;
  opacity: ${p => (p.$disabled ? 0.45 : 1)};
  pointer-events: ${p => (p.$disabled ? 'none' : 'auto')};

  /* bg/primaryEmphasis @ opacity 100 */
  &:hover {
    background: ${p =>
      getColor({
        theme: p.theme,
        variable: 'background.primaryEmphasis',
        transparency: p.theme.opacity[100],
      })};
    cursor: pointer !important;
  }
`

/* Plus action — same 32×32 / 16px icon / 24px end margin as RowAction */
const AvailableAction = styled.span.attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin-inline-start: auto;
  margin-inline-end: 24px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};

  svg {
    width: 16px;
    height: 16px;
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  }
`

const Footer = styled.footer.attrs({
  'data-inspect-token-bg': 'bg/default',
  'data-inspect-token-border': 'border/subtle',
})`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 12px 40px;
  border-top: 1px solid ${p => getColor({ theme: p.theme, variable: 'border.subtle' })};
  background: ${p => getColor({ theme: p.theme, variable: 'background.default' })};
  flex-shrink: 0;
`

const DropHint = styled.div.attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  border: 1px dashed
    ${p =>
      getColor({
        theme: p.theme,
        variable: p.$active ? 'border.primaryEmphasis' : 'border.default',
      })};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  font-size: 14px;
  /* Active: blue.100; idle: bg/subtle */
  background: ${p =>
    p.$active
      ? getColor({ theme: p.theme, hue: 'blue', shade: 100 })
      : getColor({ theme: p.theme, variable: 'background.subtle' })};
`

function systemHint(field) {
  if (!field.system) return null
  if (field.id === 'subject' || field.id === 'description') {
    return 'System field, Required for end users'
  }
  return 'System field'
}

function FormFieldAction({ field }) {
  if (field.system) {
    return (
      <span
        aria-label="Locked system field"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <LockIcon size={16} />
      </span>
    )
  }
  return (
    <IconButton
      size="small"
      aria-label={`Remove ${field.name}`}
      onClick={() => field.onRemove?.(field.id)}
    >
      <XIcon size={16} />
    </IconButton>
  )
}

function SortableFormField({ field }) {
  /* Drag only via grip — listeners stay on Grip, not the whole row */
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    data: { from: 'form', field },
  })

  return (
    <FieldRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      $dragging={isDragging}
    >
      <Grip type="button" aria-label={`Reorder ${field.name}`} {...attributes} {...listeners}>
        <GripIcon />
      </Grip>
      <IconWrap>
        <FieldTypeIcon kind={field.kind} />
      </IconWrap>
      <FieldMeta>
        <FieldName>{field.name}</FieldName>
        {field.system && <FieldHint>{systemHint(field)}</FieldHint>}
      </FieldMeta>
      <Spacer />
      <RowAction>
        <FormFieldAction field={field} />
      </RowAction>
    </FieldRow>
  )
}

function AvailableFieldItem({ field, disabled, onAdd }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `available-${field.id}`,
    data: { from: 'available', field },
    disabled,
  })

  return (
    <AvailableItem
      ref={setNodeRef}
      type="button"
      $disabled={disabled}
      style={{ opacity: isDragging ? 0.5 : undefined }}
      onClick={() => onAdd?.(field)}
      {...listeners}
      {...attributes}
    >
      <IconWrap>
        <FieldTypeIcon kind={field.kind} />
      </IconWrap>
      {field.name}
      <AvailableAction>
        <PlusIcon size={16} />
      </AvailableAction>
    </AvailableItem>
  )
}

function FormDropZone({ children, isOver }) {
  const { setNodeRef } = useDroppable({ id: 'form-fields' })
  return (
    <div ref={setNodeRef}>
      {children}
      {isOver && <DropHint $active>Drop field here</DropHint>}
    </div>
  )
}

export default function AddForm({ forms = [], onSave, onUpdate, onDelete }) {
  const theme = useTheme()
  const dragShadow = `0 8px 20px ${getColor({
    theme,
    variable: 'foreground.default',
    transparency: theme.opacity[200],
  })}`
  const showSuccessToast = useSuccessToast()
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const createType = searchParams.get('type') === 'service' ? 'service' : 'ticket'
  const existing = id ? forms.find(f => f.id === id) : null
  const isEdit = Boolean(existing)
  /* Default forms always expose end-user editability; the control is locked in product. */
  const isDefaultForm = Boolean(existing?.badges?.includes('Default'))

  const [formTitle, setFormTitle] = useState(existing?.name || '')
  const [endUserTitle, setEndUserTitle] = useState(existing?.endUserTitle || '')
  const [editableForEndUsers, setEditableForEndUsers] = useState(
    isDefaultForm ? true : (existing?.editableForEndUsers ?? false),
  )
  const [applyToAllBrands, setApplyToAllBrands] = useState(existing?.applyToAllBrands ?? true)
  const [isActive, setIsActive] = useState(existing?.active ?? true)
  const [fields, setFields] = useState(DEFAULT_FORM_FIELDS)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [activeDrag, setActiveDrag] = useState(null)
  const [overForm, setOverForm] = useState(false)
  /* 'deactivate' | 'delete' | null — default-form blocked-action modals */
  const [blockedModal, setBlockedModal] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const closeBlockedModal = () => setBlockedModal(null)
  const closeDeleteConfirm = () => setDeleteConfirmOpen(false)

  const handleConfirmDelete = () => {
    if (existing) {
      onDelete?.(existing.id)
    }
    setDeleteConfirmOpen(false)
    navigate('/forms')
  }

  const handleActionsChange = ({ value }) => {
    if (!value) return

    if (value === 'deactivate') {
      if (isDefaultForm) {
        setBlockedModal('deactivate')
        return
      }
      setIsActive(false)
      if (isEdit && existing) {
        onUpdate?.(existing.id, { active: false })
      }
      showSuccessToast('Form deactivated', 'The ticket form has been deactivated.')
      return
    }

    if (value === 'activate') {
      setIsActive(true)
      if (isEdit && existing) {
        onUpdate?.(existing.id, { active: true })
      }
      showSuccessToast('Form activated', 'The ticket form has been activated.')
      return
    }

    if (value === 'delete') {
      if (isDefaultForm) {
        setBlockedModal('delete')
        return
      }
      setDeleteConfirmOpen(true)
    }
  }

  const headingLabel = isEdit
    ? formTitle.trim() || existing?.name || 'Untitled form'
    : 'New form'

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const selectedIds = useMemo(() => new Set(fields.map(f => f.id)), [fields])

  const available = useMemo(() => {
    let list = AVAILABLE_FIELDS.filter(f => !selectedIds.has(f.id))
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(f => f.name.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'type') {
        const byType = String(a.kind || '').localeCompare(String(b.kind || ''))
        if (byType !== 0) return byType
      }
      return a.name.localeCompare(b.name)
    })
  }, [selectedIds, search, sortBy])

  const removeField = id => {
    setFields(current => current.filter(f => f.id !== id || f.system))
  }

  const handleDragStart = event => {
    setActiveDrag(event.active)
  }

  const handleDragOver = event => {
    setOverForm(event.over?.id === 'form-fields' || fields.some(f => f.id === event.over?.id))
  }

  const handleDragEnd = event => {
    const { active, over } = event
    setActiveDrag(null)
    setOverForm(false)
    if (!over) return

    const fromAvailable = active.data.current?.from === 'available'
    if (fromAvailable) {
      const field = active.data.current.field
      if (!field || selectedIds.has(field.id)) return
      setFields(current => [...current, { ...field, system: false }])
      return
    }

    if (active.id !== over.id && fields.some(f => f.id === over.id)) {
      setFields(current => {
        const oldIndex = current.findIndex(f => f.id === active.id)
        const newIndex = current.findIndex(f => f.id === over.id)
        if (oldIndex < 0 || newIndex < 0) return current
        return arrayMove(current, oldIndex, newIndex)
      })
    }
  }

  const handleSave = () => {
    const savedName = formTitle.trim() || 'Untitled form'
    const endUserEditable = isDefaultForm ? true : editableForEndUsers
    const payload = {
      name: savedName,
      badges: isDefaultForm
        ? ['Default']
        : endUserEditable
          ? []
          : ['Agent only'],
      active: isActive,
      type: existing?.type || createType,
      editableForEndUsers: endUserEditable,
      applyToAllBrands,
      brand: applyToAllBrands ? null : (existing?.brand ?? null),
      endUserTitle: endUserTitle.trim(),
    }

    if (isEdit) {
      onUpdate?.(existing.id, payload)
      showSuccessToast('Form saved', 'Your changes have been saved.')
    } else {
      onSave?.({
        id: `form-${Date.now()}`,
        ...payload,
      })
      showSuccessToast('Form created', 'The ticket form has been created.')
    }
    navigate('/forms')
  }

  const dragField =
    activeDrag?.data?.current?.field ||
    fields.find(f => f.id === activeDrag?.id) ||
    null
  const dragFromAvailable = activeDrag?.data?.current?.from === 'available'
  const dragLabel = dragField?.name || 'Field'

  if (id && !existing) {
    return <Navigate to="/forms" replace />
  }

  return (
    <Page>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Objects and rules' },
            { label: 'Tickets' },
            { label: 'Forms', path: '/forms' },
            { label: headingLabel },
          ]}
        />
        <TitleRow>
          <TitleGroup>
            <Title tag="h1">{headingLabel}</Title>
            {isDefaultForm && (
              <StatusTag size="medium" isPill>
                <span>Default</span>
              </StatusTag>
            )}
            {!isDefaultForm && !editableForEndUsers && (
              <StatusTag size="medium" isPill>
                <span>Agent only</span>
              </StatusTag>
            )}
            {isActive ? (
              <ActiveTag size="medium" isPill>
                <span>Active</span>
              </ActiveTag>
            ) : (
              /* Default Tag = neutral grey (omit hue); Flora/Garden subtle status */
              <StatusTag size="medium" isPill>
                <span>Inactive</span>
              </StatusTag>
            )}
          </TitleGroup>
          <Menu
            placement="bottom-end"
            onChange={handleActionsChange}
            button={props => (
              <ActionsButton {...props} isPill aria-label="Form actions">
                Actions
                <Button.EndIcon>
                  <ChevronDownIcon size={16} />
                </Button.EndIcon>
              </ActionsButton>
            )}
          >
            {isActive ? (
              <Item value="deactivate" label="Deactivate" />
            ) : (
              <Item value="activate" label="Activate" />
            )}
            <Item value="delete" label="Delete" type="danger" />
          </Menu>
        </TitleRow>

        <Settings>
          <SettingsField>
            <Field>
              <Label>Form title</Label>
              <Input
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder=""
              />
            </Field>
          </SettingsField>

          <EndUserSettings>
            <Field>
              <Checkbox
                checked={isDefaultForm ? true : editableForEndUsers}
                disabled={isDefaultForm}
                onChange={
                  isDefaultForm
                    ? undefined
                    : e => setEditableForEndUsers(e.target.checked)
                }
              >
                <Label>Editable for end users</Label>
                <Hint>Allow end users to select this form when submitting a ticket.</Hint>
              </Checkbox>
            </Field>

            {(isDefaultForm || editableForEndUsers) && (
              <NestedSettingsField>
                <Field>
                  <Label>Title shown to end users</Label>
                  <Input
                    value={endUserTitle}
                    onChange={e => setEndUserTitle(e.target.value)}
                    placeholder=""
                  />
                </Field>
              </NestedSettingsField>
            )}
          </EndUserSettings>

          <BrandsBlock>
            <Field>
              <Checkbox
                checked={applyToAllBrands}
                onChange={e => setApplyToAllBrands(e.target.checked)}
              >
                <Label>Apply to all brands</Label>
                <Hint>Associate this form with all current and future brands.</Hint>
              </Checkbox>
            </Field>
          </BrandsBlock>
        </Settings>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Builder>
            <FieldsLabel>
              <Field>
                <Label>Ticket fields</Label>
              </Field>
            </FieldsLabel>
            <FormColumn>
              <FormDropZone isOver={overForm && activeDrag?.data?.current?.from === 'available'}>
                <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                  <FieldList>
                    {fields.map(field => (
                      <SortableFormField
                        key={field.id}
                        field={{ ...field, onRemove: removeField }}
                      />
                    ))}
                  </FieldList>
                </SortableContext>
              </FormDropZone>
            </FormColumn>

            <Panel>
              <PanelTitle>Available ticket fields</PanelTitle>
              <PanelHint>Add fields from here to the ticket form.</PanelHint>
              <PanelControls>
                <Field>
                  <Label hidden>Search ticket fields</Label>
                  <MediaInput
                    start={<SearchIcon size={16} />}
                    placeholder=""
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </Field>
                <SortField>
                  <ComboboxField>
                    <ComboboxLabel hidden>Sort</ComboboxLabel>
                    <Combobox
                      isEditable={false}
                      selectionValue={sortBy}
                      inputProps={{ 'aria-label': 'Sort available fields' }}
                      onChange={({ selectionValue }) => {
                        if (selectionValue != null) setSortBy(String(selectionValue))
                      }}
                    >
                      <Option value="name" label="Sort by name" />
                      <Option value="type" label="Sort by type" />
                    </Combobox>
                  </ComboboxField>
                </SortField>
              </PanelControls>
              <AvailableList>
                {available.map(field => (
                  <AvailableFieldItem
                    key={field.id}
                    field={field}
                    onAdd={next => {
                      if (selectedIds.has(next.id)) return
                      setFields(current => [...current, { ...next, system: false }])
                    }}
                  />
                ))}
                {available.length === 0 && <DropHint>No matching fields</DropHint>}
              </AvailableList>
            </Panel>
          </Builder>

          <DragOverlay>
            {activeDrag && dragFromAvailable ? (
              <AvailableItem style={{ boxShadow: dragShadow }}>
                <IconWrap>
                  <FieldTypeIcon kind={dragField?.kind} />
                </IconWrap>
                {dragLabel}
                <AvailableAction>
                  <PlusIcon size={16} />
                </AvailableAction>
              </AvailableItem>
            ) : null}
            {activeDrag && !dragFromAvailable && dragField ? (
              <FieldRow
                as="div"
                $dragging
                style={{
                  boxShadow: dragShadow,
                  listStyle: 'none',
                  width: 'min(480px, 100%)',
                }}
              >
                <Grip type="button" tabIndex={-1} aria-hidden="true">
                  <GripIcon />
                </Grip>
                <IconWrap>
                  <FieldTypeIcon kind={dragField.kind} />
                </IconWrap>
                <FieldMeta>
                  <FieldName>{dragField.name}</FieldName>
                  {dragField.system && <FieldHint>{systemHint(dragField)}</FieldHint>}
                </FieldMeta>
                <Spacer />
                <RowAction>
                  {/* Keep lock / remove — do not swap to plus while dragging */}
                  <FormFieldAction field={dragField} />
                </RowAction>
              </FieldRow>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Container>

      <Footer>
        <Button isBasic isPill onClick={() => navigate('/forms')}>
          Cancel
        </Button>
        <Button isPrimary isPill onClick={handleSave}>
          Save
        </Button>
      </Footer>

      {blockedModal === 'deactivate' && (
        <Modal onClose={closeBlockedModal}>
          <Modal.Header tag="h2">Cannot deactivate default form</Modal.Header>
          <Modal.Body>You cannot deactivate a default form.</Modal.Body>
          <Modal.Footer>
            <Modal.FooterItem>
              <Button isBasic isPill onClick={closeBlockedModal}>
                Close
              </Button>
            </Modal.FooterItem>
          </Modal.Footer>
          <Modal.Close aria-label="Close modal" />
        </Modal>
      )}

      {blockedModal === 'delete' && (
        <Modal onClose={closeBlockedModal}>
          <Modal.Header tag="h2">Cannot delete default form</Modal.Header>
          <Modal.Body>You cannot delete a default form.</Modal.Body>
          <Modal.Footer>
            <Modal.FooterItem>
              <Button isBasic isPill onClick={closeBlockedModal}>
                Close
              </Button>
            </Modal.FooterItem>
          </Modal.Footer>
          <Modal.Close aria-label="Close modal" />
        </Modal>
      )}

      {deleteConfirmOpen && (
        <Modal onClose={closeDeleteConfirm}>
          <Modal.Header tag="h2" isDanger>
            Delete ticket form
          </Modal.Header>
          <Modal.Body>
            Deleting this form will permanently remove the form and its data from your account. This
            includes removing the form from all tickets in your account where this form was
            previously applied.
          </Modal.Body>
          <Modal.Footer>
            <Modal.FooterItem>
              <Button isBasic isPill onClick={closeDeleteConfirm}>
                Cancel
              </Button>
            </Modal.FooterItem>
            <Modal.FooterItem>
              <Button isDanger isPrimary isPill onClick={handleConfirmDelete}>
                Delete
              </Button>
            </Modal.FooterItem>
          </Modal.Footer>
          <Modal.Close aria-label="Close modal" />
        </Modal>
      )}
    </Page>
  )
}
