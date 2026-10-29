import { useEffect, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Anchor, Button, IconButton } from '@zendeskgarden/react-buttons'
import {
  Combobox,
  Field as ComboboxField,
  Item,
  Label as ComboboxLabel,
  Menu,
  Option,
} from '@zendeskgarden/react-dropdowns'
import { getColor } from '@zendeskgarden/react-theming'
import { MD, XXL } from '@zendeskgarden/react-typography'
import Breadcrumbs from './Breadcrumbs.v3'
import AddConditionModal from './AddConditionModal'
import { floraComboboxChevronStyles } from './floraCombobox'
import { EMPTY_CONDITIONS } from '../data/forms'
import { ChevronDownIcon, ExternalLinkIcon, OverflowIcon } from './icons'
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

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px; /* page explanation → Conditions for */
`

const HeaderCopy = styled.div`
  min-width: 0;
  max-width: 630px;
`

const Title = styled(XXL).attrs({ 'data-inspect-token-color': 'fg/default' })`
  margin: 0 0 4px; /* 4px between title and page explanation */
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
`

const Description = styled(MD).attrs({ 'data-inspect-token-color': 'fg/default' })`
  margin: 0;
  max-width: 630px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
`

const HelpLink = styled(Anchor)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-inline-start: 4px;
  vertical-align: baseline;

  svg {
    flex-shrink: 0;
  }
`

const Toolbar = styled.div`
  margin-bottom: 24px;
`

const ScopeField = styled.div.attrs({
  'data-inspect-token-border': 'border/input',
})`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 220px;
  max-width: 280px;

  ${floraComboboxChevronStyles}
`

const ScopeLabel = styled.span.attrs({ 'data-inspect-token-color': 'fg/default' })`
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
`

const ActionsButton = styled(Button).attrs({
  'data-inspect-token-border': 'button/border/default',
})`
  && {
    gap: 8px;
    /* Flora button/border/default → grey.600 #8B8E89 */
    border-color: ${p => getColor({ theme: p.theme, hue: 'neutralHue', light: { shade: 600 } })};
  }

  &&:hover {
    border-color: ${p => getColor({ theme: p.theme, hue: 'neutralHue', light: { shade: 700 } })};
  }

  && > svg,
  && [data-garden-id='buttons.icon'] {
    margin-inline-start: 0;
    /* Flora button/FG/subtle — 20×20 chevron container */
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })} !important;
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &&:hover > svg,
  &&:hover [data-garden-id='buttons.icon'],
  &&:active > svg,
  &&:active [data-garden-id='buttons.icon'] {
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })} !important;
  }

  && [data-garden-id='buttons.icon'] svg,
  && > svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })} !important;
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
  min-height: 280px;
  padding: 40px 24px;
`

const EmptyIconWrap = styled.div.attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
`

const EmptyTitle = styled.span.attrs({ 'data-inspect-token-color': 'fg/default' })`
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
`

const EmptyBody = styled.span.attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  font-size: 14px;
  line-height: 20px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
`

const EmptyCopyWrap = styled.div`
  margin-top: 16px;
`

/* Accordion well (Capsule) stack — full width inside page 40px padding */
const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

/*
 * Flora Labs Accordion well / Capsule.
 * Closed: 82px tall. Open: header min 82px; white body with same 12px corners,
 * no header/body division line (body sits inset on subtle so top radii read).
 */
const Card = styled.section.attrs({
  'data-inspect-name': 'Accordion well',
  'data-inspect-token-border': 'border/subtle',
})`
  box-sizing: border-box;
  width: 100%;
  border: 1px solid ${p => getColor({ theme: p.theme, variable: 'border.subtle' })};
  border-radius: 12px;
  background: ${p =>
    getColor({
      theme: p.theme,
      variable: p.$expanded ? 'background.subtle' : 'background.default',
    })};
  overflow: hidden;
  /* Closed default height */
  ${p =>
    !p.$expanded &&
    `
    height: 82px;
  `}
`

const CardHeader = styled.div.attrs(p => ({
  'data-inspect-token-bg': p.$expanded ? 'bg/subtle' : 'bg/default',
}))`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 20px;
  box-sizing: border-box;
  height: ${p => (p.$expanded ? 'auto' : '82px')};
  min-height: 82px;
  background: transparent;
`

const HeaderMain = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
`

const CardTitle = styled.span.attrs({ 'data-inspect-token-color': 'fg/default' })`
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`

const DeleteCardButton = styled(Button).attrs({
  'data-inspect-token-color': 'fg/danger',
})`
  && {
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.danger' })};
  }

  &&:hover,
  &&:active,
  &&:focus {
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.danger' })};
  }
`

const ExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  cursor: pointer;
  flex-shrink: 0;

  &:hover,
  &:active,
  &:focus {
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  }

  svg {
    display: block;
    width: 20px;
    height: 20px;
    fill: currentColor;
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
    transform: ${p => (p.$open ? 'rotate(180deg)' : 'none')};
    transition: transform 120ms ease;
  }
`

/* Open panel — same 12px radii as capsule; no top division line */
const CardBody = styled.div.attrs({
  'data-inspect-token-bg': 'bg/default',
})`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
  background: ${p => getColor({ theme: p.theme, variable: 'background.default' })};
  border-radius: 12px;
  border-top: none;
`

/* One rule: If | Then ~250px columns left-aligned, ⋯ top-right.
   Divider between rules (not before first / after last) — aligns with body content inset. */
const RuleBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 32px;
  width: 100%;

  & + & {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${p => getColor({ theme: p.theme, variable: 'border.subtle' })};
  }
`

const RuleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 0 0 250px;
  width: 250px;
  max-width: 250px;
  min-width: 0;
`

const RuleOverflow = styled.div`
  flex-shrink: 0;
  margin-top: -4px;
  margin-inline-start: auto;
`

/* Condition rule section headers — Medium 14/20 Bold, fg/default */
const RuleLabel = styled.span.attrs({ 'data-inspect-token-color': 'fg/default' })`
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
`

/* Condition rule values / field names — Medium 14/20 Regular, fg/default */
const RuleValue = styled.span.attrs({ 'data-inspect-token-color': 'fg/default' })`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
`

const ThenList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
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

/** Admin Center Framework empty-state info icon (circle + i). */
function InfoIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="15" cy="15" r="13" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M15 13.25v7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="15" cy="9.75" r="1" fill="currentColor" />
    </svg>
  )
}

function cloneConditions(conditions) {
  const source = conditions || EMPTY_CONDITIONS
  return {
    agents: (source.agents || []).map(c => ({
      ...c,
      rules: (c.rules || []).map(r => ({ ...r, thenShow: [...(r.thenShow || [])] })),
    })),
    endUsers: (source.endUsers || []).map(c => ({
      ...c,
      rules: (c.rules || []).map(r => ({ ...r, thenShow: [...(r.thenShow || [])] })),
    })),
  }
}

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const SCOPE_OPTIONS = [
  { value: 'agents', label: 'Agents' },
  { value: 'endUsers', label: 'End users' },
]

function normalizeScope(value) {
  return value === 'endUsers' ? 'endUsers' : 'agents'
}

function scopeLabel(value) {
  const key = normalizeScope(value)
  return SCOPE_OPTIONS.find(o => o.value === key)?.label ?? 'Agents'
}

function ConditionCard({ condition, onToggle, onDeleteCard, onRuleAction }) {
  const expanded = condition.expanded !== false

  return (
    <Card $expanded={expanded}>
      <CardHeader $expanded={expanded}>
        <HeaderMain
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${condition.fieldName}` : `Expand ${condition.fieldName}`}
          onClick={onToggle}
        >
          <CardTitle>{condition.fieldName}</CardTitle>
        </HeaderMain>
        <HeaderActions>
          {/* Accordion well “Actions” variant — section-level control in the header */}
          <DeleteCardButton isBasic isPill size="small" onClick={onDeleteCard}>
            Delete
          </DeleteCardButton>
          <ExpandButton
            type="button"
            $open={expanded}
            aria-expanded={expanded}
            aria-label={expanded ? `Collapse ${condition.fieldName}` : `Expand ${condition.fieldName}`}
            onClick={onToggle}
          >
            {/* Flora chevron-down — 20px to match Actions / Combobox */}
            <ChevronDownIcon size={20} />
          </ExpandButton>
        </HeaderActions>
      </CardHeader>

      {expanded && (
        <CardBody>
          {(condition.rules || []).map(rule => (
            <RuleBlock key={rule.id}>
              <RuleSection>
                <RuleLabel>If value is</RuleLabel>
                <RuleValue>{rule.ifValue}</RuleValue>
              </RuleSection>
              <RuleSection>
                <RuleLabel>Then show</RuleLabel>
                <ThenList>
                  {(rule.thenShow || []).map(field => (
                    <li key={field}>
                      <RuleValue>{field}</RuleValue>
                    </li>
                  ))}
                </ThenList>
              </RuleSection>
              <RuleOverflow>
                <Menu
                  placement="bottom-end"
                  onChange={({ value }) => {
                    if (value) onRuleAction(rule.id, value)
                  }}
                  button={props => (
                    <IconButton {...props} aria-label={`Actions for ${rule.ifValue}`} size="small">
                      <OverflowIcon />
                    </IconButton>
                  )}
                >
                  <Item value="edit" label="Edit" />
                  <Item value="duplicate" label="Duplicate" />
                  <Item value="delete" label="Delete" type="danger" />
                </Menu>
              </RuleOverflow>
            </RuleBlock>
          ))}
        </CardBody>
      )}
    </Card>
  )
}

export default function FormConditions({ forms = [], onUpdate }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const chevronSubtle = getColor({ theme, variable: 'foreground.subtle' })
  const showSuccessToast = useSuccessToast()
  const form = useMemo(() => forms.find(f => f.id === id), [forms, id])

  /* Default audience is Agents — never leave Conditions for blank. */
  const [scope, setScope] = useState('agents')
  const [draft, setDraft] = useState(() => cloneConditions(form?.conditions))
  const [addConditionOpen, setAddConditionOpen] = useState(false)

  useEffect(() => {
    setScope('agents')
    if (form) setDraft(cloneConditions(form.conditions))
  }, [form?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!form) {
    return <Navigate to="/forms" replace />
  }

  const scopeSelection = normalizeScope(scope)
  const scopeKey = scopeSelection
  const conditions = draft[scopeKey] || []
  const isEmpty = conditions.length === 0
  const agentHasConditions = (draft.agents || []).length > 0
  const pageTitle = `${form.name} conditions`

  const setScopeConditions = updater => {
    setDraft(current => {
      const nextList = typeof updater === 'function' ? updater(current[scopeKey] || []) : updater
      return { ...current, [scopeKey]: nextList }
    })
  }

  const handleExpandAll = expanded => {
    setScopeConditions(list => list.map(c => ({ ...c, expanded })))
  }

  const handleDeleteAll = () => {
    setScopeConditions([])
  }

  const handleCopyAgentConditions = () => {
    setDraft(current => ({
      ...current,
      endUsers: cloneConditions({ agents: current.agents, endUsers: [] }).agents.map(c => ({
        ...c,
        id: newId('cond'),
        rules: (c.rules || []).map(r => ({
          ...r,
          id: newId('rule'),
          thenShow: [...(r.thenShow || [])],
        })),
      })),
    }))
    showSuccessToast('Agent conditions copied')
  }

  const handleToggleCard = conditionId => {
    setScopeConditions(list =>
      list.map(c =>
        c.id === conditionId ? { ...c, expanded: !(c.expanded !== false) } : c,
      ),
    )
  }

  const handleDeleteCard = conditionId => {
    setScopeConditions(list => list.filter(c => c.id !== conditionId))
  }

  const handleRuleAction = (conditionId, ruleId, action) => {
    if (action === 'edit') return

    setScopeConditions(list =>
      list
        .map(c => {
          if (c.id !== conditionId) return c
          if (action === 'duplicate') {
            const source = (c.rules || []).find(r => r.id === ruleId)
            if (!source) return c
            return {
              ...c,
              rules: [
                ...(c.rules || []),
                {
                  ...source,
                  id: newId('rule'),
                  thenShow: [...(source.thenShow || [])],
                },
              ],
            }
          }
          if (action === 'delete') {
            const nextRules = (c.rules || []).filter(r => r.id !== ruleId)
            if (nextRules.length === 0) return null
            return { ...c, rules: nextRules }
          }
          return c
        })
        .filter(Boolean),
    )
  }

  const handleSave = () => {
    onUpdate?.(form.id, { conditions: cloneConditions(draft) })
    showSuccessToast('Conditions saved')
    navigate('/forms')
  }

  const handleActionsChange = ({ value }) => {
    if (!value) return
    if (value === 'add-condition') {
      setAddConditionOpen(true)
      return
    }
    if (value === 'expand-all') handleExpandAll(true)
    if (value === 'collapse-all') handleExpandAll(false)
    if (value === 'copy-agent') handleCopyAgentConditions()
    if (value === 'delete-all') handleDeleteAll()
  }

  const handleAddCondition = condition => {
    setScopeConditions(list => [...list, condition])
  }

  const emptyState = (
    <EmptyState>
      <EmptyIconWrap>
        <InfoIcon />
      </EmptyIconWrap>
      <EmptyTitle>No condition in sight</EmptyTitle>
      <EmptyBody>When you add a condition, you’ll see it here.</EmptyBody>
      {scope === 'endUsers' && agentHasConditions && (
        <EmptyCopyWrap>
          <Button isPrimary isPill onClick={handleCopyAgentConditions}>
            Copy agent conditions
          </Button>
        </EmptyCopyWrap>
      )}
    </EmptyState>
  )

  return (
    <Page>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Objects and rules' },
            { label: 'Tickets' },
            { label: 'Forms', path: '/forms' },
            { label: pageTitle },
          ]}
        />
        <PageHeader>
          <HeaderCopy>
            <Title tag="h1">{pageTitle}</Title>
            <Description>
              Add conditions to reveal fields based on user input. Parent fields define
              conditions and child fields are hidden until the conditions are met.
              <HelpLink href="#learn" onClick={e => e.preventDefault()}>
                Learn about conditions
                <ExternalLinkIcon />
              </HelpLink>
            </Description>
          </HeaderCopy>
          <Menu
            placement="bottom-end"
            onChange={handleActionsChange}
            button={props => (
              <ActionsButton {...props} isPill aria-label="Condition actions">
                Actions
                <Button.EndIcon>
                  <ChevronDownIcon size={20} />
                </Button.EndIcon>
              </ActionsButton>
            )}
          >
            <Item value="add-condition" label="Add conditions" />
            <Item value="expand-all" label="Expand all" disabled={isEmpty} />
            <Item value="collapse-all" label="Collapse all" disabled={isEmpty} />
            {scope === 'endUsers' && (
              <Item
                value="copy-agent"
                label="Copy agent conditions"
                disabled={!agentHasConditions}
              />
            )}
            <Item
              value="delete-all"
              label={
                scope === 'endUsers' ? 'Delete end user conditions' : 'Delete agent conditions'
              }
              type="danger"
              disabled={isEmpty}
            />
          </Menu>
        </PageHeader>

        <Toolbar>
          <ScopeField>
            <ScopeLabel id="conditions-for-label">Conditions for</ScopeLabel>
            <ComboboxField>
              <ComboboxLabel hidden>Conditions for</ComboboxLabel>
              {/*
                Garden select-only (isEditable=false) hardcodes Garden chevron-down-stroke
                and ignores endIcon. Use editable + readOnly so Flora ChevronDown can be
                passed as endIcon. renderValue keeps Agents visible when closed.
              */}
              <Combobox
                key={`conditions-for-${form.id}`}
                isEditable
                selectionValue={scopeSelection}
                endIcon={<ChevronDownIcon size={20} color={chevronSubtle} />}
                inputProps={{
                  readOnly: true,
                  'aria-labelledby': 'conditions-for-label',
                }}
                renderValue={({ selection }) =>
                  selection?.label || scopeLabel(scopeSelection)
                }
                onChange={({ selectionValue }) => {
                  if (selectionValue == null) return
                  setScope(normalizeScope(selectionValue))
                }}
              >
                {SCOPE_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value} label={option.label} />
                ))}
              </Combobox>
            </ComboboxField>
          </ScopeField>
        </Toolbar>

        {isEmpty ? (
          emptyState
        ) : (
          <CardList>
            {conditions.map(condition => (
              <ConditionCard
                key={condition.id}
                condition={condition}
                onToggle={() => handleToggleCard(condition.id)}
                onDeleteCard={() => handleDeleteCard(condition.id)}
                onRuleAction={(ruleId, action) => handleRuleAction(condition.id, ruleId, action)}
              />
            ))}
          </CardList>
        )}
      </Container>

      <Footer>
        <Button isBasic isPill onClick={() => navigate('/forms')}>
          Cancel
        </Button>
        <Button isPrimary isPill onClick={handleSave}>
          Save
        </Button>
      </Footer>

      {addConditionOpen && (
        <AddConditionModal
          form={form}
          scope={scopeSelection}
          existingConditions={conditions}
          onClose={() => setAddConditionOpen(false)}
          onAdd={handleAddCondition}
        />
      )}
    </Page>
  )
}
