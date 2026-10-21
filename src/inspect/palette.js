/**
 * Minimal palette for Inspect chrome + optional hex→semantic color matching.
 * Replace or extend with the host prototype's Flora/design tokens when available.
 */

export const PALETTE = {
  white: '#ffffff',
  mint: {
    500: '#01b15c',
    600: '#16a260',
  },
  grey: {
    100: '#f7f7f7',
    200: '#eae9e8',
    300: '#dcdcda',
    600: '#8b8e89',
    700: '#646864',
    900: '#2f3130',
  },
  blue: { 700: '#406cc4' },
  green: { 100: '#eef9e8', 700: '#4b7d04', 900: '#2b4a02' },
  yellow: { 100: '#faf6da', 200: '#f6eba6', 700: '#7f7004', 900: '#3b3405' },
  red: { 100: '#fff0f1', 700: '#c63f46', 900: '#681e22' },
}
