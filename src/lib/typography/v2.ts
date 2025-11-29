/**
 * V2 Typography System
 * Centralized typography styles for V2 components
 */

export const typography = {
  /**
   * Medium weight (500) - Used for most body text and labels
   */
  medium: {
    fontFamily: 'Figtree, sans-serif',
    fontWeight: 500,
  } as const,

  /**
   * Semibold weight (600) - Used for headings and emphasized text
   */
  semibold: {
    fontFamily: 'Figtree, sans-serif',
    fontWeight: 600,
  } as const,

  /**
   * Bold weight (700) - Used for strong emphasis and titles
   */
  bold: {
    fontFamily: 'Figtree, sans-serif',
    fontWeight: 700,
  } as const,

  /**
   * Regular weight (400) - Used for light text and secondary information
   */
  regular: {
    fontFamily: 'Figtree, sans-serif',
    fontWeight: 400,
  } as const,

  /**
   * DM Sans regular (400) - Used for specific components that require DM Sans
   */
  dmSans: {
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
  } as const,
} as const

// Legacy exports for backward compatibility (will be deprecated)
export const fontMedium = typography.medium
export const fontSemibold = typography.semibold
export const fontBold = typography.bold
export const fontRegular = typography.regular
export const fontDMSans = typography.dmSans

