/**
 * V2 Sizing System
 * Centralized size values for consistent component dimensions
 */

export const sizes = {
  /** Icon sizes */
  icon: {
    /** 16px - Small icons (inline, status indicators) */
    sm: '16px',
    /** 20px - Default icons (most UI icons) */
    md: '20px',
    /** 24px - Large icons */
    lg: '24px',
  },
  /** Component widths */
  width: {
    /** 280px - Side navigation */
    sideNav: '280px',
    /** 320px - Small panel/modal */
    panel: '320px',
    /** 375px - Default input width */
    input: '375px',
    /** 480px - Modal width */
    modal: '480px',
  },
  /** Component heights */
  height: {
    /** 1px - Border/separator */
    border: '1px',
    /** 4px - Progress bar */
    progressBar: '4px',
    /** 40px - Button height */
    button: '40px',
  },
  /** Border radius */
  borderRadius: {
    /** 4px - Small radius */
    sm: '4px',
    /** 8px - Default radius */
    md: '8px',
    /** 12px - Medium radius */
    lg: '12px',
    /** 16px - Large radius */
    xl: '16px',
    /** 40px - Pill shape */
    pill: '40px',
  },
} as const

