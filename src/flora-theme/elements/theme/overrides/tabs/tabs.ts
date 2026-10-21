import { css } from 'styled-components'
import { getColor } from '@zendeskgarden/react-theming'
import type { IGardenTheme } from '../../../../types'

export interface ITabThemeProps {
  theme: IGardenTheme
  $isSelected?: boolean
  $isVertical?: boolean
}

/**
 * Flora Tabs — resting unselected = FG/default;
 * selected + unselected hover = FG/primary (#406CC4), not Garden blue.
 */
export const tab = ({ theme, $isVertical }: ITabThemeProps) => {
  /* FG/primary — Flora blue.700 #406CC4 */
  const primaryFg = getColor({ theme, variable: 'foreground.primary' })
  const primaryBorder = getColor({ theme, variable: 'border.primaryEmphasis' })
  const defaultFg = getColor({ theme, variable: 'foreground.default' })
  const disabledFg = getColor({ theme, variable: 'foreground.disabled' })

  return css`
    && {
      color: ${defaultFg};
      border-color: transparent;
      border-radius: 0;
    }

    /* Unselected hover — FG/primary #406CC4 */
    &&:hover:not([aria-selected='true']),
    &&:active:not([aria-selected='true']) {
      color: ${primaryFg} !important;
    }

    /* Selected — FG/primary + blue underline */
    &&[aria-selected='true'] {
      color: ${primaryFg};
      border-color: ${primaryBorder};
    }

    &&[aria-selected='true']:hover,
    &&[aria-selected='true']:active,
    &&[aria-selected='true']:focus,
    &&[aria-selected='true']:focus-visible {
      color: ${primaryFg} !important;
      border-color: ${primaryBorder};
    }

    &&[aria-disabled='true'] {
      border-color: transparent;
      color: ${disabledFg} !important;
    }

    &&:focus-visible::before,
    &&[data-garden-focus-visible]::before {
      border-radius: ${theme.borderRadii.md};
    }

    ${$isVertical &&
    css`
      &&[aria-selected='true'] {
        border-inline-start-color: ${primaryBorder};
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
