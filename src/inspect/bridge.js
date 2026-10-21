/**
 * Tiny bridge so Inspect and Comment can share the WorkArea when both are on.
 * Inspect owns plain clicks; ⌘/Ctrl+Click asks Comment to drop a pin.
 */

const COMMENT_AT = 'prototype-comment-at'

export function requestCommentAt(clientX, clientY) {
  window.dispatchEvent(
    new CustomEvent(COMMENT_AT, { detail: { clientX, clientY } }),
  )
}

export function onCommentAt(handler) {
  const listener = (event) => {
    const { clientX, clientY } = event.detail || {}
    if (typeof clientX === 'number' && typeof clientY === 'number') {
      handler(clientX, clientY)
    }
  }
  window.addEventListener(COMMENT_AT, listener)
  return () => window.removeEventListener(COMMENT_AT, listener)
}

export function setInspectModeFlag(on) {
  if (on) document.documentElement.dataset.inspectMode = 'true'
  else delete document.documentElement.dataset.inspectMode
}

export function isInspectModeFlag() {
  return document.documentElement.dataset.inspectMode === 'true'
}
