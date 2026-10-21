import { css } from 'styled-components'
import { getColor } from '@zendeskgarden/react-theming'
import type { IGardenTheme } from '../../../../types'

export interface ITabThemeProps {
  theme: IGardenTheme
  $isSelected?: boolean
  $isVertical?: boolean
}

/**
 * Flora Tabs — selected = blue text + blue indicator; inactive = FG/default;
 * hover/focus = primary blue (matches Flora Tabs default).
 */
export const tab = ({ theme, $isVertical }: ITabThemeProps) => {
  /* Flora primary blue — same token as button/link emphasis */
  const selectedFg = getColor({ theme, variable: 'foreground.primary' })
  const selectedBorder = getColor({ theme, variable: 'border.primaryEmphasis' })
  const defaultFg = getColor({ theme, variable: 'foreground.default' })
  const disabledFg = getColor({ theme, variable: 'foreground.disabled' })

  return css`
    && {
      color: ${defaultFg};
      border-color: transparent;
      border-radius: 0;
    }

    /* Selected (Ticket forms or Service Catalog forms) — Flora blue */
    &&[aria-selected='true'] {
      color: ${selectedFg};
      border-color: ${selectedBorder};
    }

    &&:hover {
      color: ${selectedFg};
    }

    &&:active {
      border-color: currentcolor;
      color: ${selectedFg};
    }

    &&[aria-disabled='true'] {
      border-color: transparent;
      color: ${disabledFg};
    }

    /* Flora focus ring — rounded outline around the tab label */
    &&:focus-visible::before,
    &&[data-garden-focus-visible]::before {
      border-radius: ${theme.borderRadii.md};
    }

    ${$isVertical &&
    css`
      &&[aria-selected='true'] {
        border-inline-start-color: ${selectedBorder};
        border-bottom-color: transparent;
      }
    `}
  `
}

export const tabList = ({ theme }: { theme: IGardenTheme }) => {
  const borderColor = getColor({ theme, variable: 'border.default' })
  const foregroundColor = getColor({ theme, variable: 'foreground.default' })

  return css`
    && {
      color: ${foregroundColor};
      border-bottom-color: ${borderColor};
    }
  `
}
