/**
 * V2 Spacing System
 * Centralized spacing values for consistent layout
 * 
 * These values are used throughout the V2 platform for gaps, padding, and margins.
 * Prefer using Tailwind classes when possible, but use these constants for dynamic values.
 */

export const spacing = {
  /** 2px - Minimal spacing */
  xs: '2px',
  /** 4px - Small spacing */
  sm: '4px',
  /** 8px - Default small spacing */
  md: '8px',
  /** 12px - Medium spacing */
  lg: '12px',
  /** 16px - Default medium spacing */
  xl: '16px',
  /** 20px - Large spacing */
  '2xl': '20px',
  /** 24px - Extra large spacing */
  '3xl': '24px',
  /** 40px - Very large spacing */
  '4xl': '40px',
  /** 80px - Extra extra large spacing */
  '5xl': '80px',
} as const

/**
 * Common spacing combinations used in V2
 */
export const spacingPresets = {
  /** Page horizontal padding */
  pagePaddingX: spacing['5xl'], // 80px
  /** Page vertical padding */
  pagePaddingY: spacing['3xl'], // 24px
  /** Section gap */
  sectionGap: spacing['4xl'], // 40px
  /** Card padding */
  cardPadding: spacing.xl, // 16px
  /** Button padding */
  buttonPadding: spacing.xl, // 16px
  /** Input padding */
  inputPadding: spacing.xl, // 16px
} as const

