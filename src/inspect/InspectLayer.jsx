import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { PALETTE } from './palette.js'
import { requestCommentAt, setInspectModeFlag } from './bridge'
import { elementFromPointInRoot, readElementDetails } from './readStyles'

const Z = 9100
const MINT_500 = PALETTE.mint[500]

function getInspectRoot() {
  return (
    document.querySelector('[data-inspect-root="true"]') ||
    document.querySelector('[data-comment-root="true"]')
  )
}

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid ${(p) => (p.$active ? MINT_500 : '#363d44')};
  border-radius: 4px;
  background-color: ${(p) => (p.$active ? MINT_500 : 'transparent')};
  color: ${(p) => (p.$active ? '#ffffff' : '#c8cdd0')};
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: ${(p) => (p.$active ? '#16a260' : '#262c32')};
    border-color: ${(p) => (p.$active ? MINT_500 : '#555e66')};
    color: #ffffff;
  }

  &:focus-visible {
    outline: 2px solid #9affce;
    outline-offset: 2px;
  }
`

const Catcher = styled.div`
  position: fixed;
  z-index: ${Z};
  cursor: crosshair;
  background: transparent;
`

const Highlight = styled.div`
  position: fixed;
  z-index: ${Z + 1};
  pointer-events: none;
  box-sizing: border-box;
  border: 2px solid ${MINT_500};
  background: rgba(1, 177, 92, 0.12);
  border-radius: 2px;
`

const Panel = styled.aside`
  position: fixed;
  z-index: ${Z + 2};
  top: 64px;
  right: 16px;
  width: 300px;
  max-height: calc(100vh - 88px);
  overflow: auto;
  box-sizing: border-box;
  padding: 12px 14px 14px;
  border-radius: 8px;
  background: #1a1f24;
  color: #e8eaed;
  border: 1px solid #363d44;
  box-shadow: 0 8px 24px rgba(10, 13, 14, 0.28);
  font-family: inherit;
  font-size: 12px;
  line-height: 16px;
`

const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
`

const PanelTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  color: #ffffff;
  word-break: break-word;
`

const PanelHint = styled.div`
  margin: 0 0 10px;
  color: #8b9298;
  font-size: 11px;
  line-height: 14px;
`

const CloseBtn = styled.button`
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: #c8cdd0;
  cursor: pointer;
  padding: 0 2px;
  font-size: 16px;
  line-height: 1;

  &:hover {
    color: #ffffff;
  }
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 6px 8px;
  padding: 5px 0;
  border-top: 1px solid #2c333a;
`

const RowLabel = styled.div`
  color: #8b9298;
`

const RowValue = styled.div`
  color: ${(p) => (p.$token ? '#9affce' : '#e8eaed')};
  word-break: break-word;
`

const RowDetail = styled.div`
  grid-column: 2;
  color: #6b737a;
  font-size: 11px;
  margin-top: -2px;
`

const Swatch = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 6px;
  vertical-align: -1px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: ${(p) => p.$color};
`

const CopyButton = styled.button`
  margin-top: 12px;
  width: 100%;
  min-height: 28px;
  border: 1px solid #555e66;
  border-radius: 4px;
  background: transparent;
  color: #e8eaed;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #262c32;
    border-color: #6b737a;
  }
`

function boxFromEl(el) {
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { left: r.left, top: r.top, width: r.width, height: r.height }
}

function startFromUrl() {
  try {
    return new URLSearchParams(window.location.search).get('inspect') === 'true'
  } catch {
    return false
  }
}

/**
 * Inspect mode: hover to highlight, click to select, Esc / toggle to exit.
 * ⌘/Ctrl+Click places a comment when Comment mode is also on.
 */
export default function InspectLayer({
  toggleContainer,
  onActiveChange,
}) {
  const [isOn, setIsOn] = useState(startFromUrl)
  const [hoverEl, setHoverEl] = useState(null)
  const [selectedEl, setSelectedEl] = useState(null)
  const [tick, setTick] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setInspectModeFlag(isOn)
    onActiveChange?.(isOn)
    if (!isOn) {
      setHoverEl(null)
      setSelectedEl(null)
    }
    return () => setInspectModeFlag(false)
  }, [isOn, onActiveChange])

  useEffect(() => {
    if (!isOn) return undefined
    const bump = () => setTick((v) => v + 1)
    const root = getInspectRoot()
    window.addEventListener('scroll', bump, true)
    window.addEventListener('resize', bump)
    const observer = new ResizeObserver(bump)
    if (root) observer.observe(root)
    return () => {
      window.removeEventListener('scroll', bump, true)
      window.removeEventListener('resize', bump)
      observer.disconnect()
    }
  }, [isOn])

  useEffect(() => {
    if (!isOn) return undefined
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (selectedEl) {
        event.stopImmediatePropagation()
        setSelectedEl(null)
        return
      }
      event.stopImmediatePropagation()
      setIsOn(false)
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [isOn, selectedEl])

  const catcherBox = useMemo(() => {
    void tick
    if (!isOn) return null
    return boxFromEl(getInspectRoot())
  }, [tick, isOn])

  const hoverBox = useMemo(() => {
    void tick
    return boxFromEl(hoverEl)
  }, [hoverEl, tick])

  const selectedBox = useMemo(() => {
    void tick
    return boxFromEl(selectedEl)
  }, [selectedEl, tick])

  const details = useMemo(() => {
    void tick
    return selectedEl ? readElementDetails(selectedEl) : null
  }, [selectedEl, tick])

  const onMove = useCallback((event) => {
    const root = getInspectRoot()
    const el = elementFromPointInRoot(event.clientX, event.clientY, root)
    setHoverEl(el)
  }, [])

  const onClick = useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.metaKey || event.ctrlKey) {
      if (document.documentElement.dataset.commentMode === 'true') {
        requestCommentAt(event.clientX, event.clientY)
        return
      }
      /* Comment off: pass through to the prototype under the catcher. */
      const root = getInspectRoot()
      const beneath = document
        .elementsFromPoint(event.clientX, event.clientY)
        .find((el) => el instanceof Element && root?.contains(el) && !el.closest('[data-inspect-ui="true"]'))
      const clickable = beneath?.closest?.('a[href], button, input, select, [role="button"]')
      if (clickable) clickable.click()
      return
    }

    const root = getInspectRoot()
    const el = elementFromPointInRoot(event.clientX, event.clientY, root)
    setSelectedEl(el)
  }, [])

  const copyDetails = async () => {
    if (!details?.copyText) return
    try {
      await navigator.clipboard.writeText(details.copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const toggle = (
    <ToggleButton
      type="button"
      $active={isOn}
      aria-pressed={isOn}
      onClick={() => setIsOn((v) => !v)}
    >
      {isOn ? 'Exit inspect' : 'Inspect'}
    </ToggleButton>
  )

  return (
    <>
      {toggleContainer ? createPortal(toggle, toggleContainer) : toggle}

      {isOn && catcherBox && (
        <Catcher
          data-inspect-ui="true"
          onMouseMove={onMove}
          onMouseLeave={() => setHoverEl(null)}
          onClick={onClick}
          style={{
            left: catcherBox.left,
            top: catcherBox.top,
            width: catcherBox.width,
            height: catcherBox.height,
          }}
        />
      )}

      {isOn && hoverBox && hoverEl !== selectedEl && (
        <Highlight
          data-inspect-ui="true"
          style={{
            left: hoverBox.left,
            top: hoverBox.top,
            width: hoverBox.width,
            height: hoverBox.height,
          }}
        />
      )}

      {isOn && selectedBox && (
        <Highlight
          data-inspect-ui="true"
          style={{
            left: selectedBox.left,
            top: selectedBox.top,
            width: selectedBox.width,
            height: selectedBox.height,
            borderWidth: 2,
            background: 'rgba(1, 177, 92, 0.18)',
          }}
        />
      )}

      {isOn && details && (
        <Panel data-inspect-ui="true" role="dialog" aria-label="Inspect details">
          <PanelHeader>
            <PanelTitle>{details.title}</PanelTitle>
            <CloseBtn type="button" aria-label="Clear selection" onClick={() => setSelectedEl(null)}>
              ×
            </CloseBtn>
          </PanelHeader>
          <PanelHint>
            Esc clears selection, then exits Inspect. ⌘/Ctrl+click places a comment when Comment is on.
          </PanelHint>
          {details.rows.map((row) => (
            <Row key={`${row.label}:${row.value}`}>
              <RowLabel>{row.label}</RowLabel>
              <RowValue $token={row.kind === 'token'}>
                {row.kind === 'computed' && /^#|[rgb]/.test(row.value) && (
                  <Swatch $color={row.value} />
                )}
                {row.kind === 'token' && row.detail?.includes('#') && (
                  <Swatch $color={row.detail.replace(/^rendered\s+/, '')} />
                )}
                {row.value}
              </RowValue>
              {row.detail && <RowDetail>{row.detail}</RowDetail>}
            </Row>
          ))}
          <CopyButton type="button" onClick={copyDetails}>
            {copied ? 'Copied' : 'Copy values'}
          </CopyButton>
        </Panel>
      )}
    </>
  )
}
