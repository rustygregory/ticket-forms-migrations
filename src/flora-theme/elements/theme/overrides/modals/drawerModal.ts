import { css } from 'styled-components';
import type { IGardenTheme } from '../../../../types';

/** Prototype console (PrototypeBar) height — drawer must not cover it */
const PROTOTYPE_BAR_HEIGHT = 48;

/**
 * Edge-to-edge sheet below the prototype console.
 * Garden Drawer defaults to top: 0 / height: 100%; we clear inset radius and
 * leave the console outside the product overlay.
 */
export const drawerModal = () => css`
  margin: 0;
  border-radius: 0;
  top: ${PROTOTYPE_BAR_HEIGHT}px;
  height: calc(100vh - ${PROTOTYPE_BAR_HEIGHT}px);
  width: 380px;
`;

export const drawerModalClose = ({ theme }: { theme: IGardenTheme }) => css`
  border-radius: ${theme.borderRadii.lg};
`;
