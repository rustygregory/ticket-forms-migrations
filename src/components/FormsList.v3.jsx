import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Anchor, Button, IconButton, SplitButton, ChevronButton } from '@zendeskgarden/react-buttons'
import { Item, ItemGroup, Menu } from '@zendeskgarden/react-dropdowns'
import { Checkbox, Field, Label, Hint, MediaInput, Radio, Textarea } from '@zendeskgarden/react-forms'
import { Drawer, Modal } from '@zendeskgarden/react-modals'
import { Tabs } from '@zendeskgarden/react-tabs'
import { Tag } from '@zendeskgarden/react-tags'
import { getColor } from '@zendeskgarden/react-theming'
import { MD, XXL } from '@zendeskgarden/react-typography'
import Breadcrumbs from './Breadcrumbs.v3'
import {
  BRAND_OPTIONS,
  STATUS_OPTIONS,
  brandLabel,
  statusLabel,
} from '../data/forms'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  FilterIcon,
  GripIcon,
  OverflowIcon,
  SearchIcon,
} from './icons'
import { BAR_HEIGHT } from '../prototype-bar/PrototypeBar'
import { useSuccessToast } from '../hooks/useSuccessToast'

/* Flora Layout: 12px from work-area top to breadcrumb; inset.xl (40) sides */
const Container = styled.div`
  padding: 12px 40px 40px;
  overflow-y: auto;
  flex: 1;
  box-sizing: border-box;
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px; /* page explanation → first content */
`

const HeaderCopy = styled.div`
  min-width: 0;
  max-width: 630px;
`

/* Flora Typography XXL (26/32) page title */
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

/* Form name — Flora Medium 14/20, Bold, FG/default (not Anchor; avoids link/tag chrome) */
const FormNameButton = styled.button.attrs({ 'data-inspect-token-color': 'fg/default' })`
  border: none;
  background: transparent;
  padding: 0;
  font: inherit;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600; /* Bold */
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
  cursor: pointer;
  text-align: left;

  &:hover {
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.primary' })};
    text-decoration: underline;
  }
`

/* Flora Filters: 20px from header/description block to search + filter */
const Instructions = styled.div`
  margin-bottom: 20px;
  max-width: 630px;

  /* Flora Textarea — resizable; 60px default so the drag handle is obvious */
  textarea {
    width: 100%;
    max-width: 630px;
    height: 60px;
    min-height: 60px;
    box-sizing: border-box;
  }
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`

const SearchWrap = styled.div`
  min-width: 400px;
  width: 400px;

  /* Flora Input: 40px max height; 12px left padding; Magnifying glass */
  [data-garden-id='forms.faux_input'] {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: 40px;
    max-height: 40px;
    padding: 10px 12px;
    line-height: 20px;
  }

  [data-garden-id='forms.faux_input'] > svg {
    width: 16px !important;
    height: 16px !important;
    margin: 0 8px 0 0 !important;
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })} !important;
    flex-shrink: 0;
  }
`

const FilterAnchor = styled.div`
  position: relative;
`

/* Flora Menu for V1 nested Brand/Status filters — wider than the Filter trigger */
const FilterMenu = styled(Menu)`
  &&[data-garden-id='dropdowns.menu'] {
    min-width: 240px;
  }
`

/* Outline Filter media button — 8px between start icon and label.
   V1 open: Flora button active fill (fg/subtle @ opacity 100) + border/emphasis. */
const FilterButton = styled(Button)`
  && {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  /* Keep filter (sliders) start icon visible when open — do not hide on expand */
  && [data-garden-id='buttons.icon'] {
    display: inline-flex;
    flex-shrink: 0;
    margin-inline-end: 0;
    opacity: 1;
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  }

  && [data-garden-id='buttons.icon'] svg {
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  }

  ${p =>
    p.$legacyOpen &&
    `
    &&,
    &&:hover,
    &&:active {
      background-color: ${getColor({
        theme: p.theme,
        variable: 'foreground.subtle',
        transparency: p.theme.opacity[100],
      })};
      border-color: ${getColor({ theme: p.theme, variable: 'border.emphasis' })};
    }
  `}
`

const FilterChevron = styled.span.attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  display: inline-flex;
  margin-inline-start: 4px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};

  svg {
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
  }
`

/* Flora filter tags: category semibold + value regular */
const FilterTagCategory = styled.span`
  font-weight: 600;
`

const FilterTagValue = styled.span`
  font-weight: 400;
`

/* Tags + Clear filters — 8px between chips group and Clear */
const FilterRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  min-height: 28px;
`

/* 4px between filter tags */
const FilterChips = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
`

/* Flora Filters: 12px above / below result count relative to tags + table */
const ResultsMeta = styled(MD).attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  margin: 12px 0 12px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Row = styled.li.attrs({
  'data-inspect-token-bg': 'bg/default',
  'data-inspect-token-border': 'border/default',
})`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px 12px 8px;
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
  opacity: ${p => (p.$dragging ? 0.92 : 1)};

  /* Table/list row hover — bg/primaryEmphasis @ opacity 100 */
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
  border-radius: 6px;
  padding: 0;

  &:active {
    cursor: grabbing;
  }
`

const Badges = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
`

/* Flora medium Tag in list rows — 12px type, min-height 20px, pill (table/list) */
const ListTag = styled(Tag)`
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
const ActiveListTag = styled(ListTag).attrs({
  'data-inspect-name': 'Tag',
  'data-inspect-token-bg': 'tag/bg/mint',
  'data-inspect-token-color': 'tag/fg/mint',
})`
  && {
    background-color: ${p => getColor({ theme: p.theme, variable: 'tag.bg.mint' })};
    color: ${p => getColor({ theme: p.theme, variable: 'tag.fg.mint' })};
  }
`

const Spacer = styled.span`
  flex: 1;
`

const Empty = styled(MD).attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  padding: 0 0 32px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
`

/* ——— V2 filter drawer (Garden Drawer + Flora theme) ——— */
const DrawerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`

const DrawerSectionTitle = styled(MD).attrs({ 'data-inspect-token-color': 'fg/default' })`
  margin: 0 0 4px;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
`

/* Drawer footer: results left, Cancel + Apply right */
const DrawerFooterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`

const ResultsCount = styled.span.attrs({ 'data-inspect-token-color': 'fg/subtle' })`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })};
`

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-inline-start: auto;
`

function formMatchesBrand(form, brandValue) {
  if (brandValue === 'none') return form.brand == null
  return form.brand === brandValue
}

/** Empty selection = all brands. Otherwise match any selected brand. */
function formMatchesBrands(form, brandValues) {
  if (!brandValues?.length) return true
  return brandValues.some(value => formMatchesBrand(form, value))
}

function toggleBrandValue(list, value) {
  if (list.includes(value)) return list.filter(v => v !== value)
  return [...list, value]
}

function formMatchesStatus(form, statusValue) {
  if (statusValue === 'active') return form.active
  if (statusValue === 'inactive') return !form.active
  return true
}

function SortableFormRow({ form, onOpen, onSetActive }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: form.id,
  })
  const isDefault = form.badges?.includes('Default')
  const otherBadges = (form.badges || []).filter(badge => badge !== 'Default')
  /* Same blocked modals as edit form for default ticket form */
  const [blockedModal, setBlockedModal] = useState(null)
  const showSuccessToast = useSuccessToast()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const closeBlockedModal = () => setBlockedModal(null)

  const handleMenuChange = ({ value }) => {
    if (!value) return

    if (value === 'deactivate') {
      if (isDefault) {
        setBlockedModal('deactivate')
        return
      }
      onSetActive?.(form.id, false)
      showSuccessToast('Form deactivated', 'The ticket form has been deactivated.')
      return
    }

    if (value === 'activate') {
      onSetActive?.(form.id, true)
      showSuccessToast('Form activated', 'The ticket form has been activated.')
      return
    }

    if (value === 'make-default') {
      if (isDefault) {
        setBlockedModal('make-default')
      }
    }
  }

  return (
    <>
      <Row ref={setNodeRef} style={style} $dragging={isDragging}>
        <Grip type="button" aria-label={`Reorder ${form.name}`} {...attributes} {...listeners}>
          <GripIcon />
        </Grip>
        <FormNameButton type="button" onClick={() => onOpen?.(form.id)}>
          {form.name}
        </FormNameButton>
        <Badges>
          {isDefault && (
            <ListTag size="medium" isPill>
              <span>Default</span>
            </ListTag>
          )}
          {otherBadges.map(badge => (
            <ListTag key={badge} size="medium" isPill>
              <span>{badge}</span>
            </ListTag>
          ))}
          {form.active ? (
            <ActiveListTag size="medium" isPill>
              <span>Active</span>
            </ActiveListTag>
          ) : (
            <ListTag size="medium" isPill>
              <span>Inactive</span>
            </ListTag>
          )}
        </Badges>
        <Spacer />
        <Menu
          placement="bottom-end"
          onChange={handleMenuChange}
          button={props => (
            <IconButton {...props} aria-label={`More actions for ${form.name}`} size="small">
              <OverflowIcon />
            </IconButton>
          )}
        >
          <Item value="conditions" label="Conditions" />
          <Item value="clone" label="Clone" />
          <Item value="make-default" label="Make default" />
          {form.active ? (
            isDefault ? (
              <Item value="deactivate" label="Deactivate" />
            ) : (
              <Item value="deactivate" label="Deactivate" type="danger" />
            )
          ) : (
            <Item value="activate" label="Activate" />
          )}
        </Menu>
      </Row>

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

      {blockedModal === 'make-default' && (
        <Modal onClose={closeBlockedModal}>
          <Modal.Header tag="h2">Ticket form is already default</Modal.Header>
          <Modal.Body>This ticket form is already the default form.</Modal.Body>
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
    </>
  )
}

function FilterDrawer({
  open,
  onClose,
  statusFilter,
  brandFilter,
  forms,
  tab,
  search,
  onApply,
}) {
  /* Draft selections — only commit on Apply filters */
  const [draftStatus, setDraftStatus] = useState(statusFilter)
  const [draftBrands, setDraftBrands] = useState(brandFilter)

  useEffect(() => {
    if (open) {
      setDraftStatus(statusFilter)
      setDraftBrands(brandFilter)
    }
  }, [open, statusFilter, brandFilter])

  const resultCount = useMemo(() => {
    return forms.filter(form => {
      if (form.type !== tab) return false
      if (draftStatus && !formMatchesStatus(form, draftStatus)) return false
      if (!formMatchesBrands(form, draftBrands)) return false
      if (search.trim() && !form.name.toLowerCase().includes(search.trim().toLowerCase())) {
        return false
      }
      return true
    }).length
  }, [forms, tab, search, draftStatus, draftBrands])

  const handleCancel = () => {
    onClose?.()
  }

  const handleApply = () => {
    onApply?.({ status: draftStatus, brands: draftBrands })
    onClose?.()
  }

  return (
    <Drawer
      isOpen={open}
      onClose={handleCancel}
      /* Scrim + sheet sit below the prototype console (outside the product area) */
      backdropProps={{
        style: {
          top: BAR_HEIGHT,
          height: `calc(100vh - ${BAR_HEIGHT}px)`,
        },
      }}
    >
      <Drawer.Header tag="h2">Filter</Drawer.Header>
      <Drawer.Close aria-label="Close filters" />
      <Drawer.Body>
        <DrawerSection>
          <DrawerSectionTitle tag="h3" isBold>
            Brand
          </DrawerSectionTitle>
          {BRAND_OPTIONS.map(option => (
            <Field key={option.value}>
              <Checkbox
                checked={draftBrands.includes(option.value)}
                onChange={() => setDraftBrands(current => toggleBrandValue(current, option.value))}
              >
                <Label isRegular>{option.label}</Label>
              </Checkbox>
            </Field>
          ))}
        </DrawerSection>
        <DrawerSection>
          <DrawerSectionTitle tag="h3" isBold>
            Status
          </DrawerSectionTitle>
          {STATUS_OPTIONS.map(option => (
            <Field key={option.value}>
              <Radio
                name="filter-status-draft"
                value={option.value}
                checked={draftStatus === option.value}
                onChange={() =>
                  setDraftStatus(current => (current === option.value ? null : option.value))
                }
              >
                <Label isRegular>{option.label}</Label>
              </Radio>
            </Field>
          ))}
        </DrawerSection>
      </Drawer.Body>
      <Drawer.Footer>
        <DrawerFooterBar>
          <ResultsCount>
            {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </ResultsCount>
          <FooterActions>
            <Button isBasic isPill onClick={handleCancel}>
              Cancel
            </Button>
            <Button isPrimary isPill onClick={handleApply}>
              Apply filters
            </Button>
          </FooterActions>
        </DrawerFooterBar>
      </Drawer.Footer>
    </Drawer>
  )
}

export default function FormsList({ version = 'v2', forms, setForms }) {
  const navigate = useNavigate()
  const [instructions, setInstructions] = useState('{{zd.default_ticket_forms_instructions}}')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('ticket')
  /* Shared across Ticket / Service Catalog tabs — sits above tab hierarchy */
  const [statusFilter, setStatusFilter] = useState('active')
  const [brandFilter, setBrandFilter] = useState([]) /* multi-select brand values */
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterPanel, setFilterPanel] = useState('root')

  const isV1 = version === 'v1'

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const filterSelectedItems = useMemo(() => {
    const items = brandFilter.map(value => ({ value, type: 'checkbox' }))
    if (statusFilter) {
      items.push({ value: statusFilter, name: 'status', type: 'radio' })
    }
    return items
  }, [brandFilter, statusFilter])

  const handleV1FilterChange = changes => {
    if (changes.selectedItems) {
      setBrandFilter(
        changes.selectedItems.filter(item => item.type === 'checkbox').map(item => item.value),
      )
      const statusItem = changes.selectedItems.find(
        item => item.type === 'radio' && item.name === 'status',
      )
      setStatusFilter(statusItem?.value ?? null)
      /* Selectable clicks also report isExpanded: false — keep menu open for multi-select */
      return
    }

    if (changes.isExpanded !== undefined) {
      setFilterOpen(changes.isExpanded)
      if (!changes.isExpanded) setFilterPanel('root')
    }

    if (changes.value === 'goto-brand') setFilterPanel('brand')
    if (changes.value === 'goto-status') setFilterPanel('status')
    if (changes.value === 'back-brand' || changes.value === 'back-status') {
      setFilterPanel('root')
    }
  }

  const visibleForms = useMemo(() => {
    return forms.filter(form => {
      if (form.type !== tab) return false
      if (statusFilter && !formMatchesStatus(form, statusFilter)) return false
      if (!formMatchesBrands(form, brandFilter)) return false
      if (search.trim() && !form.name.toLowerCase().includes(search.trim().toLowerCase())) return false
      return true
    })
  }, [forms, tab, statusFilter, brandFilter, search])

  const onDragEnd = event => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setForms(current => {
      const typed = current.filter(f => f.type === tab)
      const others = current.filter(f => f.type !== tab)
      const oldIndex = typed.findIndex(f => f.id === active.id)
      const newIndex = typed.findIndex(f => f.id === over.id)
      if (oldIndex < 0 || newIndex < 0) return current
      return [...others, ...arrayMove(typed, oldIndex, newIndex)]
    })
  }

  const clearFilters = () => {
    setStatusFilter(null)
    setBrandFilter([])
    setSearch('')
  }

  const hasFilterChips = Boolean(statusFilter || brandFilter.length)
  const showClear = hasFilterChips || Boolean(search.trim())

  return (
    <Container>
      <Breadcrumbs
        items={[
          { label: 'Objects and rules' },
          { label: 'Tickets' },
          { label: 'Forms' },
        ]}
      />

      <PageHeader>
        <HeaderCopy>
          <Title tag="h1">Forms</Title>
          <Description tag="p">
            Forms are predefined sets of fields for specific types of support requests. You can create
            different forms for different products or workflows.
            <HelpLink href="#learn" onClick={e => e.preventDefault()}>
              Learn about forms
              <ExternalLinkIcon />
            </HelpLink>
          </Description>
        </HeaderCopy>

        <SplitButton>
          <Button isPrimary isPill onClick={() => navigate('/forms/new?type=ticket')}>
            Add ticket form
          </Button>
          <Menu
            placement="bottom-end"
            onChange={({ value }) => {
              if (value === 'ticket') navigate('/forms/new?type=ticket')
              if (value === 'service') navigate('/forms/new?type=service')
            }}
            button={props => (
              <ChevronButton {...props} isPrimary isPill aria-label="More add options" />
            )}
          >
            <Item value="ticket" label="Ticket forms" />
            <Item value="service" label="Service Catalog forms" />
          </Menu>
        </SplitButton>
      </PageHeader>

      <Instructions>
        <Field>
          <Label>End user instructions</Label>
          <Hint>Text shown to end users when multiple forms are available</Hint>
          <Textarea
            isResizable
            minRows={1}
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder=""
          />
        </Field>
      </Instructions>

      <Toolbar>
        <SearchWrap>
          <Field>
            <Label hidden>Search Forms</Label>
            <MediaInput
              start={<SearchIcon size={16} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Field>
        </SearchWrap>

        <FilterAnchor>
          {isV1 ? (
            <FilterMenu
              isExpanded={filterOpen}
              onChange={handleV1FilterChange}
              selectedItems={filterSelectedItems}
              placement="bottom-start"
              button={props => (
                <FilterButton {...props} isPill isNeutral $legacyOpen={filterOpen}>
                  <Button.StartIcon>
                    <FilterIcon />
                  </Button.StartIcon>
                  Filter
                  <FilterChevron>
                    {filterOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                  </FilterChevron>
                </FilterButton>
              )}
            >
              {filterPanel === 'root' && (
                <>
                  <Item value="goto-brand" type="next" label="Brand" />
                  <Item value="goto-status" type="next" label="Status" />
                </>
              )}
              {filterPanel === 'brand' && (
                <>
                  <Item value="back-brand" type="previous" label="Brands" />
                  <ItemGroup type="checkbox" aria-label="Brands">
                    {BRAND_OPTIONS.map(option => (
                      <Item key={option.value} value={option.value} label={option.label} />
                    ))}
                  </ItemGroup>
                </>
              )}
              {filterPanel === 'status' && (
                <>
                  <Item value="back-status" type="previous" label="Status" />
                  <ItemGroup type="radio" name="status" aria-label="Status">
                    {STATUS_OPTIONS.map(option => (
                      <Item
                        key={option.value}
                        value={option.value}
                        label={option.label}
                        name="status"
                      />
                    ))}
                  </ItemGroup>
                </>
              )}
            </FilterMenu>
          ) : (
            /* Advanced Filter (Drawer): Default Button + filter (sliders) start icon */
            <FilterButton
              isPill
              aria-expanded={filterOpen}
              aria-haspopup="dialog"
              onClick={() => setFilterOpen(open => !open)}
            >
              <Button.StartIcon>
                <FilterIcon />
              </Button.StartIcon>
              Filter
            </FilterButton>
          )}
        </FilterAnchor>
      </Toolbar>

      {(hasFilterChips || showClear) && (
        <FilterRow>
          {hasFilterChips && (
            <FilterChips>
              {statusFilter && (
                <Tag isPill={false}>
                  <span>
                    <FilterTagCategory>Status</FilterTagCategory>
                    {' '}
                    <FilterTagValue>{statusLabel(statusFilter)}</FilterTagValue>
                  </span>
                  <Tag.Close
                    aria-label={`Remove Status ${statusLabel(statusFilter)} filter`}
                    onClick={() => setStatusFilter(null)}
                  />
                </Tag>
              )}
              {brandFilter.map(value => (
                <Tag key={value} isPill={false}>
                  <span>
                    <FilterTagCategory>Brand</FilterTagCategory>
                    {' '}
                    <FilterTagValue>{brandLabel(value)}</FilterTagValue>
                  </span>
                  <Tag.Close
                    aria-label={`Remove Brand ${brandLabel(value)} filter`}
                    onClick={() => setBrandFilter(current => current.filter(v => v !== value))}
                  />
                </Tag>
              ))}
            </FilterChips>
          )}
          {showClear && (
            <Button isBasic size="small" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </FilterRow>
      )}

      <Tabs selectedItem={tab} onChange={setTab}>
        <Tabs.TabList>
          <Tabs.Tab item="ticket">Ticket forms</Tabs.Tab>
          <Tabs.Tab item="service">Service Catalog forms</Tabs.Tab>
        </Tabs.TabList>
        <Tabs.TabPanel item="ticket" />
        <Tabs.TabPanel item="service" />
      </Tabs>

      <ResultsMeta tag="p">
        {visibleForms.length} {visibleForms.length === 1 ? 'result' : 'results'}
      </ResultsMeta>

      {visibleForms.length === 0 ? (
        <Empty tag="p">No forms match your search or filters.</Empty>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={visibleForms.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <List>
              {visibleForms.map(form => (
                <SortableFormRow
                  key={form.id}
                  form={form}
                  onOpen={formId => navigate(`/forms/${formId}`)}
                  onSetActive={(formId, active) =>
                    setForms(current =>
                      current.map(f => (f.id === formId ? { ...f, active } : f)),
                    )
                  }
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      )}

      {!isV1 && (
        <FilterDrawer
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          statusFilter={statusFilter}
          brandFilter={brandFilter}
          forms={forms}
          tab={tab}
          search={search}
          onApply={({ status, brands }) => {
            setStatusFilter(status)
            setBrandFilter(brands)
          }}
        />
      )}
    </Container>
  )
}
