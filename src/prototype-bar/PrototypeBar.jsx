import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Tooltip } from '@zendeskgarden/react-tooltips'
import VersionNotesPanel from './VersionNotesPanel'

/**
 * Reviewer chrome: a compact dark strip above the product prototype.
 *
 * Keeps prototype identity (title + meta) and controls (version switcher,
 * comment toggle) visible without interfering with the design being reviewed.
 *
 * Visual language matches the organization-hierarchy prototype bar — very dark
 * band, outlined controls, pipe separator, dark dropdown menu.
 *
 * Host-agnostic — knows nothing about brands, options or comments:
 *   title / meta          what this is and its version or date
 *   versions              [{ id, label, description?, archived?, badge?, badgeTooltip? }] for the switcher
 *   versionId             which entry is currently selected
 *   onVersionChange       called with the new id when the user picks one
 *   versionNotes          [{ versionId, date, summary, sections }] — the living
 *                          changelog behind the "Version notes" button
 *   commentSlotRef        callback ref for a CommentLayer portal target
 *   inspectSlotRef        callback ref for an InspectLayer portal target
 *   inspectActive         when true, bar uses Mint/500 so Inspect mode is obvious
 */

export const BAR_HEIGHT = 48

/* Above the comment layer (9000–9003) so the menu stays clickable with comment
   mode on — the bar is also where the way OUT of comment mode is. */
const MENU_Z = 9500

/* Flora palette mint.500 — Inspect console signal.
   Ink colors are dark mint/near-black so title, meta, and controls stay readable. */
const MINT_500 = '#01b15c'
const MINT_INK = '#0e261a'
const MINT_INK_MUTED = '#143726'
const MINT_BORDER = 'rgba(14, 38, 26, 0.4)'
const MINT_CONTROL_HOVER = 'rgba(14, 38, 26, 0.12)'

const Bar = styled.header`
  position: relative;
  z-index: 600; /* Above Garden Drawer/scrim (500) — console stays outside product overlay */
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: ${BAR_HEIGHT}px;
  padding: 0 16px;
  background-color: ${(p) => (p.$inspectActive ? MINT_500 : '#1a1f24')};
  color: ${(p) => (p.$inspectActive ? MINT_INK : '#ffffff')};
  font-family: inherit;
  user-select: none;
  transition: background-color 0.15s ease, color 0.15s ease;
`

const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
`

const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => (p.$inspectActive ? MINT_INK : '#ffffff')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Pipe = styled.span`
  flex-shrink: 0;
  color: ${(p) => (p.$inspectActive ? MINT_BORDER : '#363d44')};
  font-size: 13px;
  line-height: 1;
`

const Meta = styled.span`
  flex-shrink: 0;
  color: ${(p) => (p.$inspectActive ? MINT_INK_MUTED : '#7c8590')};
  font-size: 12px;
  white-space: nowrap;
`

/* Day only, abbreviated month (not all-caps), no ordinal: "Oct 5, 2026". */
const MONTHS = [
  null,
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function formatUpdatedDate(isoDate) {
  if (typeof isoDate !== 'string') return null
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d || !MONTHS[m]) return null
  return `${MONTHS[m]} ${d}, ${y}`
}

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const DropdownWrapper = styled.div`
  position: relative;
`

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid ${(p) => {
    if (p.$inspectActive) return p.$open ? MINT_INK : MINT_BORDER
    return p.$open ? '#555e66' : '#363d44'
  }};
  border-radius: 4px;
  background: ${(p) => {
    if (p.$inspectActive) return p.$open ? MINT_CONTROL_HOVER : 'transparent'
    return p.$open ? '#262c32' : 'transparent'
  }};
  color: ${(p) => (p.$inspectActive ? MINT_INK : '#ffffff')};
  font-family: inherit;
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: ${(p) => (p.$inspectActive ? MINT_CONTROL_HOVER : '#262c32')};
    border-color: ${(p) => (p.$inspectActive ? MINT_INK : '#555e66')};
    color: ${(p) => (p.$inspectActive ? MINT_INK : '#ffffff')};
  }
`

/* Label and description side by side in the trigger. */
const TriggerContent = styled.div`
  display: flex;
  align-items: baseline;
  gap: 7px;
`

const TriggerLabel = styled.span`
  font-weight: 600;
`

const TriggerDesc = styled.span`
  font-weight: 400;
  color: ${(p) => (p.$inspectActive ? MINT_INK : '#ffffff')};
  font-size: 12px;
`

/* Filled downward triangle, matches org-hierarchy's CaretIcon. Flips when open. */
const Caret = styled.svg`
  flex-shrink: 0;
  transform: ${(p) => (p.$open ? 'rotate(180deg)' : 'none')};
`

const CaretIcon = ({ $open }) => (
  <Caret $open={$open} width="8" height="5" viewBox="0 0 8 5" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M0 0 L4 5 L8 0 Z" />
  </Caret>
)

/* Dark dropdown — grows to fit its longest item (width: max-content), never wraps. */
const Menu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: ${MENU_Z};
  padding: 4px 0;
  border: 1px solid #363d44;
  border-radius: 4px;
  background-color: #262c32;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  width: max-content;
`

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 14px;
  border: 0;
  background: ${(p) => (p.$selected ? '#323b44' : 'transparent')};
  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: #323b44;
    color: #ffffff;
  }
`

/* Fixed-width so item text lines up whether or not the row is selected. */
const Check = styled.span`
  flex-shrink: 0;
  width: 12px;
  color: #6ba4e0;
  font-size: 11px;
`

const ItemContent = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`

const ItemTitle = styled.span`
  font-weight: 600;
`

const ItemDesc = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #ffffff;
`

/* Compact count pill — e.g. content-design update count on a version row. */
const ItemBadge = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  margin-left: 4px;
  border-radius: 999px;
  background: #ff00ff;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  cursor: help;
`

const BadgeTooltipBody = styled.div`
  white-space: pre-line;
  text-align: left;
  max-width: 280px;
`

function VersionBadge({ count, tooltip }) {
  const badge = (
    <ItemBadge aria-label={`${count} content design updates`}>
      {count}
    </ItemBadge>
  )

  if (!tooltip) return badge

  return (
    <Tooltip
      content={<BadgeTooltipBody>{tooltip}</BadgeTooltipBody>}
      placement="bottom"
      type="dark"
      size="large"
      zIndex={MENU_Z + 1}
      delayMS={200}
    >
      {badge}
    </Tooltip>
  )
}

const MenuDivider = styled.div`
  height: 1px;
  background: #363d44;
  margin: 4px 0;
`

const MenuSectionLabel = styled.div`
  padding: 5px 14px 2px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #ffffff;
`

const CommentSlot = styled.div`
  display: flex;
  align-items: center;
`

const NotesWrapper = styled.div`
  position: relative;
`

/* Same outlined-pill language as the version Trigger, minus the caret. */
const NotesButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid ${(p) => {
    if (p.$inspectActive) return p.$open ? MINT_INK : MINT_BORDER
    return p.$open ? '#555e66' : '#363d44'
  }};
  border-radius: 4px;
  background: ${(p) => {
    if (p.$inspectActive) return p.$open ? MINT_CONTROL_HOVER : 'transparent'
    return p.$open ? '#262c32' : 'transparent'
  }};
  color: ${(p) => (p.$inspectActive ? MINT_INK : '#c8cdd0')};
  font-family: inherit;
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: ${(p) => (p.$inspectActive ? MINT_CONTROL_HOVER : '#262c32')};
    border-color: ${(p) => (p.$inspectActive ? MINT_INK : '#555e66')};
    color: ${(p) => (p.$inspectActive ? MINT_INK : '#ffffff')};
  }
`

const NotesIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M3 1.5h6l2 2v9H3v-11z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="M5 6h4M5 8.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export default function PrototypeBar({
  title,
  meta,
  versions,
  versionId,
  onVersionChange,
  versionLabel = 'Version',
  versionNotes,
  commentSlotRef,
  inspectSlotRef,
  inspectActive = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const dropdownRef = useRef(null)
  const notesRef = useRef(null)

  const selected = versions?.find((v) => v.id === versionId)
  const activeVersions = versions?.filter((v) => !v.archived) ?? []
  const archivedVersions = versions?.filter((v) => v.archived) ?? []
  const updatedLabel =
    typeof __BUILD_DATE__ !== 'undefined' ? formatUpdatedDate(__BUILD_DATE__) : null
  const metaText = [meta, updatedLabel ? `Updated ${updatedLabel}` : null]
    .filter(Boolean)
    .join(' · ')

  /* Close on outside click and Escape. Capture phase so comment mode's
     click-catcher (which stops propagation) can't swallow the close. */
  useEffect(() => {
    if (!isOpen) return undefined
    const onPointerDown = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setIsOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  /* Same close behavior for the version notes document. */
  useEffect(() => {
    if (!notesOpen) return undefined
    const onPointerDown = (e) => {
      if (!notesRef.current?.contains(e.target)) setNotesOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setNotesOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [notesOpen])

  return (
    <Bar $inspectActive={inspectActive} data-inspect-console={inspectActive ? 'true' : undefined}>
      <Identity>
        <Title $inspectActive={inspectActive}>{title}</Title>
        {metaText && (
          <>
            <Pipe $inspectActive={inspectActive} aria-hidden="true">|</Pipe>
            <Meta $inspectActive={inspectActive}>{metaText}</Meta>
          </>
        )}
      </Identity>

      <Controls>
        {versions?.length > 0 && (
          <DropdownWrapper ref={dropdownRef}>
            <Trigger
              type="button"
              $open={isOpen}
              $inspectActive={inspectActive}
              onClick={() => { setNotesOpen(false); setIsOpen((v) => !v) }}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
            >
              <TriggerContent>
                <TriggerLabel>{selected?.label ?? versionLabel}</TriggerLabel>
                {selected?.description && (
                  <TriggerDesc $inspectActive={inspectActive}>{selected.description}</TriggerDesc>
                )}
                {selected?.badge != null && (
                  <VersionBadge count={selected.badge} tooltip={selected.badgeTooltip} />
                )}
              </TriggerContent>
              <CaretIcon $open={isOpen} />
            </Trigger>

            {isOpen && (
              <Menu role="listbox" aria-label={versionLabel}>
                {activeVersions.map((entry) => (
                  <MenuItem
                    key={entry.id}
                    type="button"
                    role="option"
                    aria-selected={entry.id === versionId}
                    $selected={entry.id === versionId}
                    onClick={() => {
                      setIsOpen(false)
                      if (entry.id !== versionId) onVersionChange?.(entry.id)
                    }}
                  >
                    <Check>{entry.id === versionId ? '✓' : ''}</Check>
                    <ItemContent>
                      <ItemTitle>{entry.label}</ItemTitle>
                      {entry.description && <ItemDesc>{entry.description}</ItemDesc>}
                      {entry.badge != null && (
                        <VersionBadge count={entry.badge} tooltip={entry.badgeTooltip} />
                      )}
                    </ItemContent>
                  </MenuItem>
                ))}

                {archivedVersions.length > 0 && (
                  <>
                    <MenuDivider />
                    <MenuSectionLabel>Archive</MenuSectionLabel>
                    {archivedVersions.map((entry) => (
                      <MenuItem
                        key={entry.id}
                        type="button"
                        role="option"
                        aria-selected={entry.id === versionId}
                        $selected={entry.id === versionId}
                        onClick={() => {
                          setIsOpen(false)
                          if (entry.id !== versionId) onVersionChange?.(entry.id)
                        }}
                      >
                        <Check>{entry.id === versionId ? '✓' : ''}</Check>
                        <ItemContent>
                          <ItemTitle>{entry.label}</ItemTitle>
                          {entry.description && <ItemDesc>{entry.description}</ItemDesc>}
                          {entry.badge != null && (
                            <VersionBadge count={entry.badge} tooltip={entry.badgeTooltip} />
                          )}
                        </ItemContent>
                      </MenuItem>
                    ))}
                  </>
                )}
              </Menu>
            )}
          </DropdownWrapper>
        )}

        {versionNotes?.length > 0 && (
          <NotesWrapper ref={notesRef}>
            <NotesButton
              type="button"
              $open={notesOpen}
              $inspectActive={inspectActive}
              onClick={() => { setIsOpen(false); setNotesOpen((v) => !v) }}
              aria-expanded={notesOpen}
              aria-haspopup="dialog"
            >
              <NotesIcon />
              Version notes
            </NotesButton>

            {notesOpen && (
              <VersionNotesPanel
                entries={versionNotes}
                versions={versions}
                activeVersionId={versionId}
                onGoToVersion={(id) => {
                  setNotesOpen(false)
                  if (id !== versionId) onVersionChange?.(id)
                }}
                onClose={() => setNotesOpen(false)}
              />
            )}
          </NotesWrapper>
        )}

        {/* InspectLayer / CommentLayer portal their toggles into these slots. */}
        <CommentSlot ref={inspectSlotRef} />
        <CommentSlot ref={commentSlotRef} />
      </Controls>
    </Bar>
  )
}
