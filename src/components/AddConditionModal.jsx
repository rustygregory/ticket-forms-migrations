import { useMemo, useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import {
  Combobox,
  Field as ComboboxField,
  Label as ComboboxLabel,
  Option,
} from '@zendeskgarden/react-dropdowns'
import { Checkbox, Field, Label, Message } from '@zendeskgarden/react-forms'
import { Modal } from '@zendeskgarden/react-modals'
import { getColor } from '@zendeskgarden/react-theming'
import {
  DEFAULT_CONDITION_PARENT_FIELDS,
  getConditionParentFields,
} from '../data/forms'
import { FieldTypeIcon } from './icons'

/** “If value is” options — used values stay visible but disabled. */
const FIELD_VALUES = {
  'approval-status': ['Pending', 'Approved', 'Rejected', 'Withdrawn'],
  type: ['Question', 'Incident', 'Problem', 'Task'],
  priority: ['Low', 'Normal', 'High', 'Urgent'],
  language: ['English', 'Spanish', 'French', 'German'],
  'language-confidence': ['High', 'Medium', 'Low'],
  topic: ['Billing', 'Technical', 'Account', 'Other'],
  'topic-confidence': ['High', 'Medium', 'Low'],
  sentiment: ['Positive', 'Negative', 'Neutral'],
  'sentiment-confidence': ['High', 'Medium', 'Low'],
  summary: ['—'],
  'summary-agent-id': ['—'],
  'summary-date-time': ['—'],
  'summary-locale': ['—'],
  'entity-test': ['—'],
}

/** Per-field Required dropdown (ticket status timing). */
const REQUIRED_OPTIONS = [
  'Never',
  'Always',
  'New',
  'Open',
  'In Progress',
  'Pending',
  'Solved',
]

/** Collect ifValues already used for a parent field across existing conditions. */
function usedIfValuesForField(conditions, fieldName) {
  const used = new Set()
  for (const condition of conditions || []) {
    if (condition.fieldName !== fieldName) continue
    for (const rule of condition.rules || []) {
      if (rule.ifValue) used.add(rule.ifValue)
    }
  }
  return used
}

/** Flora large modal — max-width 755px, min-height 500px; footer pinned to bottom. */
const LargeModal = styled(Modal)`
  && {
    display: flex;
    flex-direction: column;
    width: min(755px, calc(100vw - 48px));
    max-width: 755px;
    min-height: 500px;
    overflow: visible;
  }

  && [data-garden-id='modals.body'] {
    flex: 1 1 auto;
    overflow: visible;
  }

  && [data-garden-id='modals.footer'] {
    flex-shrink: 0;
    margin-top: auto;
  }
`

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 100%;
`

/**
 * Modal Combobox — light Flora chrome only.
 * Avoid absolute chevron / padding overrides here; they break open/select
 * inside the modal focus trap. Listbox stays inside the modal node.
 */
const comboboxChrome = css`
  [data-garden-id='dropdowns.combobox.trigger'] {
    border-color: ${p => getColor({ theme: p.theme, variable: 'border.input' })};
    cursor: pointer;
  }

  [data-garden-id='dropdowns.combobox.trigger']:hover {
    border-color: ${p => getColor({ theme: p.theme, variable: 'border.primaryEmphasis' })};
  }

  [data-garden-id='dropdowns.combobox.input_icon'] {
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })} !important;
  }

  [data-garden-id='dropdowns.combobox.input_icon'] svg {
    color: inherit;
    fill: currentColor;
  }

  [data-garden-id='dropdowns.combobox.option.type_icon'] {
    display: none !important;
  }

  [data-garden-id='dropdowns.combobox.option.icon'],
  [data-garden-id='dropdowns.combobox.option.icon'] svg {
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })} !important;
  }
`

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 400px;

  ${comboboxChrome}
`

const ThenSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 560px;
`

const ThenHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 140px;
  gap: 12px;
  align-items: end;
`

const ThenRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 140px;
  gap: 12px;
  align-items: start;
`

const ThenFieldCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  ${comboboxChrome}
`

const RequiredCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  ${comboboxChrome}
`

const RequiredLabel = styled(ComboboxLabel)`
  && {
    font-weight: 600;
  }
`

const SectionLabel = styled(ComboboxLabel)`
  && {
    font-weight: 600;
  }
`

const FooterExtras = styled.div`
  display: flex;
  align-items: center;
  margin-inline-end: auto;
`

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function AddConditionModal({
  form,
  scope = 'agents',
  existingConditions = [],
  onClose,
  onAdd,
}) {
  const audience = scope === 'endUsers' ? 'end users' : 'agents'
  const parentFields = useMemo(
    () => getConditionParentFields(form) || DEFAULT_CONDITION_PARENT_FIELDS,
    [form],
  )

  /* Keep listboxes inside the modal so the focus trap doesn’t kill them */
  const [modalNode, setModalNode] = useState(null)
  const modalRef = useCallback(node => {
    setModalNode(node)
  }, [])

  const [parentFieldId, setParentFieldId] = useState(undefined)
  const [ifValue, setIfValue] = useState(undefined)
  /** @type {[{ fieldId: string, required: string }]} */
  const [thenRows, setThenRows] = useState([])
  const [addPickerValue, setAddPickerValue] = useState(undefined)
  const [addAnother, setAddAnother] = useState(false)
  const [showParentError, setShowParentError] = useState(false)

  const parentField = useMemo(
    () => parentFields.find(f => f.id === parentFieldId) || null,
    [parentFieldId, parentFields],
  )

  const valueOptions = parentFieldId ? FIELD_VALUES[parentFieldId] || [] : []
  const usedIfValues = useMemo(
    () => usedIfValuesForField(existingConditions, parentField?.name),
    [existingConditions, parentField?.name],
  )
  const thenOptions = useMemo(
    () => parentFields.filter(f => f.id !== parentFieldId),
    [parentFields, parentFieldId],
  )
  const selectedThenIds = useMemo(() => thenRows.map(r => r.fieldId), [thenRows])
  const remainingThenOptions = useMemo(
    () => thenOptions.filter(f => !selectedThenIds.includes(f.id)),
    [thenOptions, selectedThenIds],
  )
  const hasParent = Boolean(parentFieldId)
  const showThenSection = hasParent
  const showAddPicker = showThenSection && remainingThenOptions.length > 0

  const resetForm = () => {
    setParentFieldId(undefined)
    setIfValue(undefined)
    setThenRows([])
    setAddPickerValue(undefined)
    setShowParentError(false)
  }

  const handleClose = () => {
    resetForm()
    setAddAnother(false)
    onClose?.()
  }

  const handleAddThenField = fieldId => {
    if (!fieldId || selectedThenIds.includes(fieldId)) return
    setThenRows(rows => [...rows, { fieldId, required: 'Never' }])
    setAddPickerValue(undefined)
  }

  const handleChangeThenField = (index, fieldId) => {
    if (!fieldId) return
    setThenRows(rows =>
      rows.map((row, i) => (i === index ? { ...row, fieldId: String(fieldId) } : row)),
    )
  }

  const handleChangeRequired = (index, required) => {
    if (!required) return
    setThenRows(rows =>
      rows.map((row, i) => (i === index ? { ...row, required: String(required) } : row)),
    )
  }

  const handleAdd = () => {
    if (!parentFieldId || !parentField) {
      setShowParentError(true)
      return
    }

    const thenShow = thenRows
      .map(row => parentFields.find(f => f.id === row.fieldId)?.name)
      .filter(Boolean)

    onAdd?.({
      id: newId('cond'),
      fieldName: parentField.name,
      expanded: true,
      rules: [
        {
          id: newId('rule'),
          ifValue: ifValue || valueOptions[0] || '—',
          thenShow: thenShow.length ? thenShow : thenOptions.slice(0, 1).map(f => f.name),
          thenRequired: thenRows.map(row => ({
            fieldId: row.fieldId,
            required: row.required,
          })),
        },
      ],
    })

    if (addAnother) {
      resetForm()
      return
    }
    handleClose()
  }

  const listboxProps = {
    listboxAppendToNode: modalNode || undefined,
    listboxZIndex: 1,
  }

  return (
    <LargeModal
      ref={modalRef}
      isLarge
      isCentered
      appendToNode={typeof document !== 'undefined' ? document.body : undefined}
      onClose={handleClose}
    >
      <Modal.Header tag="h2">Add conditions for {audience}</Modal.Header>
      <Modal.Body>
        <FormStack>
          <FieldBlock>
            <ComboboxField>
              <RequiredLabel>When filling out this field* (required)</RequiredLabel>
              <Combobox
                isEditable={false}
                selectionValue={parentFieldId}
                validation={showParentError && !parentFieldId ? 'error' : undefined}
                placeholder="Type or select a field"
                inputProps={{ 'aria-label': 'When filling out this field' }}
                listboxAriaLabel="Fields"
                {...listboxProps}
                renderValue={({ selection }) => selection?.label || ''}
                onChange={({ selectionValue }) => {
                  if (selectionValue == null) return
                  setParentFieldId(String(selectionValue))
                  setIfValue(undefined)
                  setThenRows([])
                  setAddPickerValue(undefined)
                  setShowParentError(false)
                }}
              >
                {parentFields.map(field => (
                  <Option
                    key={field.id}
                    value={field.id}
                    label={field.name}
                    icon={<FieldTypeIcon kind={field.kind} />}
                  />
                ))}
              </Combobox>
              {showParentError && !parentFieldId && (
                <Message validation="error">Select a field to continue.</Message>
              )}
            </ComboboxField>
          </FieldBlock>

          {hasParent && (
            <FieldBlock>
              <ComboboxField>
                <RequiredLabel>If value is*</RequiredLabel>
                <Combobox
                  isEditable={false}
                  selectionValue={ifValue}
                  placeholder="Type or select a field"
                  inputProps={{ 'aria-label': 'If value is' }}
                  listboxAriaLabel="Values"
                  {...listboxProps}
                  renderValue={({ selection }) => selection?.label || ''}
                  onChange={({ selectionValue }) => {
                    if (selectionValue == null) return
                    if (usedIfValues.has(String(selectionValue))) return
                    setIfValue(String(selectionValue))
                    setThenRows([])
                    setAddPickerValue(undefined)
                  }}
                >
                  {valueOptions.map(value => (
                    <Option
                      key={value}
                      value={value}
                      label={value}
                      isDisabled={usedIfValues.has(value)}
                    />
                  ))}
                </Combobox>
              </ComboboxField>
            </FieldBlock>
          )}

          {showThenSection && (
            <ThenSection>
              <ThenHeader>
                <SectionLabel>Then show these fields*</SectionLabel>
                {thenRows.length > 0 ? <SectionLabel>Required</SectionLabel> : <span />}
              </ThenHeader>

              {thenRows.map((row, index) => {
                const selectedField = thenOptions.find(f => f.id === row.fieldId)
                return (
                  <ThenRow key={`${row.fieldId}-${index}`}>
                    <ThenFieldCell>
                      <ComboboxField>
                        <ComboboxLabel hidden>Then show field {index + 1}</ComboboxLabel>
                        <Combobox
                          isEditable={false}
                          selectionValue={row.fieldId}
                          inputProps={{
                            'aria-label': `Then show field ${index + 1}`,
                          }}
                          listboxAriaLabel="Fields to show"
                          {...listboxProps}
                          renderValue={({ selection }) => selection?.label || ''}
                          onChange={({ selectionValue }) => {
                            if (selectionValue == null) return
                            if (
                              selectedThenIds.includes(String(selectionValue)) &&
                              String(selectionValue) !== row.fieldId
                            ) {
                              return
                            }
                            handleChangeThenField(index, selectionValue)
                          }}
                        >
                          {thenOptions.map(field => (
                            <Option
                              key={field.id}
                              value={field.id}
                              label={field.name}
                              icon={<FieldTypeIcon kind={field.kind} />}
                              isDisabled={
                                selectedThenIds.includes(field.id) && field.id !== row.fieldId
                              }
                            />
                          ))}
                        </Combobox>
                      </ComboboxField>
                    </ThenFieldCell>
                    <RequiredCell>
                      <ComboboxField>
                        <ComboboxLabel hidden>
                          Required for {selectedField?.name || 'field'}
                        </ComboboxLabel>
                        <Combobox
                          isEditable={false}
                          selectionValue={row.required}
                          inputProps={{
                            'aria-label': `Required for ${selectedField?.name || 'field'}`,
                          }}
                          listboxAriaLabel="Required"
                          {...listboxProps}
                          renderValue={({ selection }) => selection?.label || ''}
                          onChange={({ selectionValue }) => {
                            if (selectionValue == null) return
                            handleChangeRequired(index, selectionValue)
                          }}
                        >
                          {REQUIRED_OPTIONS.map(option => (
                            <Option key={option} value={option} label={option} />
                          ))}
                        </Combobox>
                      </ComboboxField>
                    </RequiredCell>
                  </ThenRow>
                )
              })}

              {showAddPicker && (
                <ThenRow>
                  <ThenFieldCell>
                    <ComboboxField>
                      <ComboboxLabel hidden>Add field to show</ComboboxLabel>
                      <Combobox
                        key={`add-then-${selectedThenIds.join('-') || 'empty'}`}
                        isEditable={false}
                        selectionValue={addPickerValue}
                        placeholder="Type or select a field"
                        inputProps={{ 'aria-label': 'Add field to show' }}
                        listboxAriaLabel="Fields to show"
                        {...listboxProps}
                        renderValue={({ selection }) => selection?.label || ''}
                        onChange={({ selectionValue }) => {
                          if (selectionValue == null) return
                          handleAddThenField(String(selectionValue))
                        }}
                      >
                        {thenOptions.map(field => (
                          <Option
                            key={field.id}
                            value={field.id}
                            label={field.name}
                            icon={<FieldTypeIcon kind={field.kind} />}
                            isDisabled={selectedThenIds.includes(field.id)}
                          />
                        ))}
                      </Combobox>
                    </ComboboxField>
                  </ThenFieldCell>
                  <span />
                </ThenRow>
              )}
            </ThenSection>
          )}
        </FormStack>
      </Modal.Body>
      <Modal.Footer>
        <FooterExtras>
          <Field>
            <Checkbox
              checked={addAnother}
              onChange={e => setAddAnother(e.target.checked)}
            >
              <Label isRegular>Add another</Label>
            </Checkbox>
          </Field>
        </FooterExtras>
        <Modal.FooterItem>
          <Button isBasic isPill onClick={handleClose}>
            Cancel
          </Button>
        </Modal.FooterItem>
        <Modal.FooterItem>
          <Button isPrimary isPill onClick={handleAdd}>
            Add
          </Button>
        </Modal.FooterItem>
      </Modal.Footer>
      <Modal.Close aria-label="Close modal" />
    </LargeModal>
  )
}
