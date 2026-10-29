import { css } from 'styled-components'
import { getColor } from '@zendeskgarden/react-theming'

/**
 * Flora select Combobox — chevron placement (exact).
 *
 * Spec:
 *   - 20×20 Flora chevron, fg/subtle
 *   - 12px from the right edge of the field
 *   - 10px from the top and bottom (40px tall content box)
 *
 * Pass Flora ChevronDown via endIcon with isEditable + inputProps.readOnly.
 * ChevronDownIcon must forward className / data-garden-id onto the SVG.
 */
export const floraComboboxChevronStyles = css`
  [data-garden-id='dropdowns.combobox.trigger'] {
    position: relative;
    box-sizing: border-box;
    /* 40px content + 1px borders so 10 + 20 + 10 lands cleanly */
    height: 42px;
    min-height: 42px;
    padding: 0 !important;
    border-color: ${p => getColor({ theme: p.theme, variable: 'border.input' })};
    cursor: pointer;
  }

  [data-garden-id='dropdowns.combobox.trigger']:hover {
    border-color: ${p => getColor({ theme: p.theme, variable: 'border.primaryEmphasis' })};
  }

  [data-garden-id='dropdowns.combobox.container'] {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    /* left text inset; right reserves 12px + 20px chevron */
    padding-inline: 12px 32px;
  }

  [data-garden-id='dropdowns.combobox.input_group'] {
    flex: 1 1 auto;
    min-width: 0;
    align-items: center;
  }

  /* End chevron IS the SVG (garden-id cloned onto it) */
  [data-garden-id='dropdowns.combobox.container']
    > [data-garden-id='dropdowns.combobox.input_icon']:last-child {
    position: absolute !important;
    top: 10px !important;
    right: 12px !important;
    left: auto !important;
    bottom: auto !important;
    z-index: 1;
    box-sizing: border-box;
    width: 20px !important;
    height: 20px !important;
    margin: 0 !important;
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })} !important;
    fill: currentColor;
    transition: transform 0.25s ease-in-out, color 0.25s ease-in-out;
  }

  [data-garden-id='dropdowns.combobox.trigger']:hover
    > [data-garden-id='dropdowns.combobox.container']
    > [data-garden-id='dropdowns.combobox.input_icon']:last-child,
  [data-garden-id='dropdowns.combobox.trigger']:focus-within
    > [data-garden-id='dropdowns.combobox.container']
    > [data-garden-id='dropdowns.combobox.input_icon']:last-child {
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.subtle' })} !important;
  }

  [data-garden-id='dropdowns.combobox.trigger'][aria-expanded='true']
    > [data-garden-id='dropdowns.combobox.container']
    > [data-garden-id='dropdowns.combobox.input_icon']:last-child {
    transform: rotate(180deg);
  }

  [data-garden-id='dropdowns.combobox.value'],
  [data-garden-id='dropdowns.combobox.input'],
  [data-garden-id='dropdowns.combobox'] input {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: ${p => getColor({ theme: p.theme, variable: 'foreground.default' })};
    cursor: pointer;
  }
`
