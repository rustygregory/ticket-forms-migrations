/**
 * Distance between two element boxes — outside-to-outside gaps, or
 * inset when one contains the other (inside of a container).
 */

function roundPx(n) {
  if (!Number.isFinite(n)) return 0
  return Math.round(n)
}

/** @param {{ left: number, top: number, width: number, height: number }} box */
export function boxEdges(box) {
  return {
    left: box.left,
    top: box.top,
    right: box.left + box.width,
    bottom: box.top + box.height,
    width: box.width,
    height: box.height,
    midX: box.left + box.width / 2,
    midY: box.top + box.height / 2,
  }
}

function contains(outer, inner) {
  return (
    outer.left <= inner.left + 0.5 &&
    outer.top <= inner.top + 0.5 &&
    outer.right >= inner.right - 0.5 &&
    outer.bottom >= inner.bottom - 0.5
  )
}

/**
 * @returns {{ mode: 'inset' | 'gap', guides: Array<{
 *   id: string,
 *   axis: 'h' | 'v',
 *   x1: number, y1: number, x2: number, y2: number,
 *   labelX: number, labelY: number,
 *   px: number,
 *   label: string,
 * }>, summary: string[] }}
 */
export function measureBoxes(selectedBox, hoverBox) {
  if (!selectedBox || !hoverBox) {
    return { mode: 'gap', guides: [], summary: [] }
  }

  const a = boxEdges(selectedBox)
  const b = boxEdges(hoverBox)

  /* Hover is the container around the selection → inset to inside edges */
  if (contains(b, a) && (b.width > a.width + 1 || b.height > a.height + 1)) {
    return insetGuides(a, b, 'to container')
  }
  /* Selection contains hover → inset from selected edges to inner element */
  if (contains(a, b) && (a.width > b.width + 1 || a.height > b.height + 1)) {
    return insetGuides(b, a, 'inside selection')
  }

  return gapGuides(a, b)
}

function insetGuides(inner, outer, note) {
  const guides = []
  const summary = []

  const top = roundPx(inner.top - outer.top)
  const right = roundPx(outer.right - inner.right)
  const bottom = roundPx(outer.bottom - inner.bottom)
  const left = roundPx(inner.left - outer.left)

  if (top > 0) {
    guides.push({
      id: 'inset-top',
      axis: 'v',
      x1: inner.midX,
      y1: outer.top,
      x2: inner.midX,
      y2: inner.top,
      labelX: inner.midX,
      labelY: (outer.top + inner.top) / 2,
      px: top,
      label: `${top}`,
    })
    summary.push(`Top inset ${top}px`)
  }
  if (bottom > 0) {
    guides.push({
      id: 'inset-bottom',
      axis: 'v',
      x1: inner.midX,
      y1: inner.bottom,
      x2: inner.midX,
      y2: outer.bottom,
      labelX: inner.midX,
      labelY: (inner.bottom + outer.bottom) / 2,
      px: bottom,
      label: `${bottom}`,
    })
    summary.push(`Bottom inset ${bottom}px`)
  }
  if (left > 0) {
    guides.push({
      id: 'inset-left',
      axis: 'h',
      x1: outer.left,
      y1: inner.midY,
      x2: inner.left,
      y2: inner.midY,
      labelX: (outer.left + inner.left) / 2,
      labelY: inner.midY,
      px: left,
      label: `${left}`,
    })
    summary.push(`Left inset ${left}px`)
  }
  if (right > 0) {
    guides.push({
      id: 'inset-right',
      axis: 'h',
      x1: inner.right,
      y1: inner.midY,
      x2: outer.right,
      y2: inner.midY,
      labelX: (inner.right + outer.right) / 2,
      labelY: inner.midY,
      px: right,
      label: `${right}`,
    })
    summary.push(`Right inset ${right}px`)
  }

  if (summary.length === 0) {
    summary.push(`Flush (${note})`)
  } else {
    summary.unshift(`Inset ${note}`)
  }

  return { mode: 'inset', guides, summary }
}

function gapGuides(a, b) {
  const guides = []
  const summary = []

  /* Horizontal outside gap */
  if (a.right < b.left) {
    const gap = roundPx(b.left - a.right)
    const y = clampOverlapMid(a.top, a.bottom, b.top, b.bottom) ?? (a.midY + b.midY) / 2
    guides.push({
      id: 'gap-h',
      axis: 'h',
      x1: a.right,
      y1: y,
      x2: b.left,
      y2: y,
      labelX: (a.right + b.left) / 2,
      labelY: y,
      px: gap,
      label: `${gap}`,
    })
    summary.push(`Horizontal ${gap}px`)
  } else if (b.right < a.left) {
    const gap = roundPx(a.left - b.right)
    const y = clampOverlapMid(a.top, a.bottom, b.top, b.bottom) ?? (a.midY + b.midY) / 2
    guides.push({
      id: 'gap-h',
      axis: 'h',
      x1: b.right,
      y1: y,
      x2: a.left,
      y2: y,
      labelX: (b.right + a.left) / 2,
      labelY: y,
      px: gap,
      label: `${gap}`,
    })
    summary.push(`Horizontal ${gap}px`)
  }

  /* Vertical outside gap */
  if (a.bottom < b.top) {
    const gap = roundPx(b.top - a.bottom)
    const x = clampOverlapMid(a.left, a.right, b.left, b.right) ?? (a.midX + b.midX) / 2
    guides.push({
      id: 'gap-v',
      axis: 'v',
      x1: x,
      y1: a.bottom,
      x2: x,
      y2: b.top,
      labelX: x,
      labelY: (a.bottom + b.top) / 2,
      px: gap,
      label: `${gap}`,
    })
    summary.push(`Vertical ${gap}px`)
  } else if (b.bottom < a.top) {
    const gap = roundPx(a.top - b.bottom)
    const x = clampOverlapMid(a.left, a.right, b.left, b.right) ?? (a.midX + b.midX) / 2
    guides.push({
      id: 'gap-v',
      axis: 'v',
      x1: x,
      y1: b.bottom,
      x2: x,
      y2: a.top,
      labelX: x,
      labelY: (b.bottom + a.top) / 2,
      px: gap,
      label: `${gap}`,
    })
    summary.push(`Vertical ${gap}px`)
  }

  /* Overlapping / stacked — still show center-to-center deltas when no clear gap */
  if (guides.length === 0) {
    const dx = roundPx(Math.abs(b.midX - a.midX))
    const dy = roundPx(Math.abs(b.midY - a.midY))
    if (dx > 0) {
      const x1 = Math.min(a.midX, b.midX)
      const x2 = Math.max(a.midX, b.midX)
      guides.push({
        id: 'center-h',
        axis: 'h',
        x1,
        y1: a.midY,
        x2,
        y2: a.midY,
        labelX: (x1 + x2) / 2,
        labelY: a.midY,
        px: dx,
        label: `${dx}`,
      })
      summary.push(`Center Δx ${dx}px`)
    }
    if (dy > 0) {
      const y1 = Math.min(a.midY, b.midY)
      const y2 = Math.max(a.midY, b.midY)
      guides.push({
        id: 'center-v',
        axis: 'v',
        x1: a.midX,
        y1,
        x2: a.midX,
        y2,
        labelX: a.midX,
        labelY: (y1 + y2) / 2,
        px: dy,
        label: `${dy}`,
      })
      summary.push(`Center Δy ${dy}px`)
    }
  }

  if (summary.length === 0) summary.push('Overlapping / aligned')
  return { mode: 'gap', guides, summary }
}

function clampOverlapMid(a0, a1, b0, b1) {
  const start = Math.max(a0, b0)
  const end = Math.min(a1, b1)
  if (end <= start) return null
  return (start + end) / 2
}
