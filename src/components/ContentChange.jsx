import styled from 'styled-components'
import { Tooltip } from '@zendeskgarden/react-tooltips'

/* Bright fuchsia so content-design diffs read clearly on white UI. */
const FUCHSIA = '#FF00FF'

const Mark = styled.span`
  color: ${FUCHSIA};
  font-weight: 600;
  cursor: help;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
`

/**
 * When `active`, shows the new copy in fuchsia with a hover tooltip of the
 * old → new change. When inactive, renders the baseline (from) string.
 */
export default function ContentChange({ active, from, to, children }) {
  const text = children ?? (active ? to : from)

  if (!active) {
    return text
  }

  return (
    <Tooltip
      content={`Changed from “${from}” to “${to}”`}
      placement="top"
      type="dark"
      size="medium"
      zIndex={10000}
      delayMS={200}
    >
      <Mark>{text}</Mark>
    </Tooltip>
  )
}
