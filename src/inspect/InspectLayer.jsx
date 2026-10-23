import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { PALETTE } from './palette.js'
import { requestCommentAt, setInspectModeFlag } from './bridge'
import { measureBoxes } from './measure'
import { elementFromPointInRoot, readElementDetails } from './readStyles'

const Z = 9100
const MINT_500 = PALETTE.mint[500]
const MEASURE = '#ff6b4a'

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

const MeasureLine = styled.div`
  position: fixed;
  z-index: ${Z + 3};
  pointer-events: none;
  background: ${MEASURE};
`

const MeasureLabel = styled.div`
  position: fixed;
  z-index: ${Z + 4};
  pointer-events: none;
  transform: translate(-50%, -50%);
  padding: 1px 5px;
  border-radius: 3px;
  background: ${MEASURE};
  color: #ffffff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  font-weight: 600;
  line-height: 14px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
`

const Panel = styled.aside`
  position: fixed;
  z-index: ${Z + 5};
  width: 300px;
  max-height: calc(100vh - 88px);
  overflow: auto;
  box-sizing: border-box;
  padding: 0 0 14px;
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
  padding: 12px 14px 0;
  cursor: grab;
  user-select: none;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`

const PanelBody = styled.div`
  padding: 0 14px;
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
  color: ${(p) => (p.$token ? '#9affce' : p.$measure ? MEASURE : '#e8eaed')};
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
 * With a selection, hover another element to measure gaps / insets.
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
  const [panelPos, setPanelPos] = useState({ top: 64, left: null, right: 16 })
  const dragRef = useRef(null)

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

  const measure = useMemo(() => {
    void tick
    if (!selectedBox || !hoverBox || !hoverEl || hoverEl === selectedEl) {
      return { mode: 'gap', guides: [], summary: [] }
    }
    return measureBoxes(selectedBox, hoverBox)
  }, [selectedBox, hoverBox, hoverEl, selectedEl, tick])

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

  const onPanelPointerDown = useCallback((event) => {
    if (event.button !== 0) return
    if (event.target.closest('button')) return
    event.preventDefault()
    const panel = event.currentTarget.closest('[data-inspect-panel="true"]')
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    dragRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)

    const onMoveDrag = (e) => {
      const d = dragRef.current
      if (!d) return
      const maxLeft = window.innerWidth - d.width - 8
      const maxTop = window.innerHeight - Math.min(d.height, window.innerHeight - 16) - 8
      const left = Math.min(Math.max(8, e.clientX - d.offsetX), Math.max(8, maxLeft))
      const top = Math.min(Math.max(8, e.clientY - d.offsetY), Math.max(8, maxTop))
      setPanelPos({ top, left, right: null })
    }
    const onUp = (e) => {
      dragRef.current = null
      window.removeEventListener('pointermove', onMoveDrag)
      window.removeEventListener('pointerup', onUp)
      try {
        event.currentTarget.releasePointerCapture?.(e.pointerId)
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('pointermove', onMoveDrag)
    window.addEventListener('pointerup', onUp)
  }, [])

  const copyDetails = async () => {
    if (!details?.copyText) return
    const measureBlock =
      measure.summary.length > 0 ? `\n\nMeasure:\n${measure.summary.join('\n')}` : ''
    try {
      await navigator.clipboard.writeText(`${details.copyText}${measureBlock}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const panelStyle =
    panelPos.left != null
      ? { top: panelPos.top, left: panelPos.left, right: 'auto' }
      : { top: panelPos.top, right: panelPos.right ?? 16, left: 'auto' }

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

      {isOn &&
        measure.guides.map((g) => {
          const isH = g.axis === 'h'
          const length = isH ? Math.abs(g.x2 - g.x1) : Math.abs(g.y2 - g.y1)
          if (length < 1) return null
          return (
            <div key={g.id}>
              <MeasureLine
                data-inspect-ui="true"
                style={
                  isH
                    ? {
                        left: Math.min(g.x1, g.x2),
                        top: g.y1 - 0.5,
                        width: length,
                        height: 1,
                      }
                    : {
                        left: g.x1 - 0.5,
                        top: Math.min(g.y1, g.y2),
                        width: 1,
                        height: length,
                      }
                }
              />
              <MeasureLabel
                data-inspect-ui="true"
                style={{ left: g.labelX, top: g.labelY }}
              >
                {g.label}px
              </MeasureLabel>
            </div>
          )
        })}

      {isOn && details && (
        <Panel
          data-inspect-ui="true"
          data-inspect-panel="true"
          role="dialog"
          aria-label="Inspect details"
          style={panelStyle}
        >
          <PanelHeader onPointerDown={onPanelPointerDown} title="Drag to move">
            <PanelTitle>{details.title}</PanelTitle>
            <CloseBtn type="button" aria-label="Clear selection" onClick={() => setSelectedEl(null)}>
              ×
            </CloseBtn>
          </PanelHeader>
          <PanelBody>
            <PanelHint>
              Drag this panel to move it. Select one element, then hover another to measure gaps
              (outside) or insets (inside a container). Esc clears, then exits.
            </PanelHint>
            {measure.summary.map((line) => (
              <Row key={line}>
                <RowLabel>Measure</RowLabel>
                <RowValue $measure>{line}</RowValue>
              </Row>
            ))}
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
          </PanelBody>
        </Panel>
      )}
    </>
  )
}
