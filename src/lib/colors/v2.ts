/**
 * V2 Color System
 * TypeScript constants that map to CSS variables defined in globals.css
 * 
 * This provides type-safe access to V2 colors while maintaining
 * the CSS variable system as the single source of truth.
 */

// ============================================================================
// CSS VARIABLE REFERENCES
// ============================================================================
// These constants reference CSS variables defined in globals.css
// Use these for inline styles or when you need TypeScript access to colors

export const colors = {
  // Background colors
  background: {
    primary: 'var(--v2-background-primary)',
    secondary: 'var(--v2-background-secondary)',
    card: 'var(--v2-background-secondary)', // Card uses secondary background
  },
  // Text colors
  text: {
    primary: 'var(--v2-text-primary)',
    secondary: 'var(--v2-text-secondary)',
    muted: 'var(--v2-text-muted)',
    accent: 'var(--v2-text-accent)',
    button: 'var(--v2-text-button)',
    caret: 'var(--v2-text-caret)',
    error: 'var(--v2-text-error)',
    info: 'var(--v2-text-info)',
  },
  // Border colors
  border: {
    default: 'var(--v2-border-default)',
    light: 'var(--v2-border-light)',
    active: 'var(--v2-border-active)',
    error: 'var(--v2-border-error)',
  },
  // Brand colors
  brand: {
    primary: 'var(--v2-brand-primary)',
  },
  // Status colors
  status: {
    error: 'var(--v2-status-error)',
    applied: {
      bg: 'var(--v2-status-applied-bg)',
      border: 'var(--v2-status-applied-border)',
      text: 'var(--v2-status-applied-text)',
    },
    rejected: {
      bg: 'var(--v2-status-rejected-bg)',
      border: 'var(--v2-status-rejected-border)',
      text: 'var(--v2-status-rejected-text)',
    },
    interview: {
      bg: 'var(--v2-status-interview-bg)',
      border: 'var(--v2-status-interview-border)',
      text: 'var(--v2-status-interview-text)',
    },
    offer: {
      bg: 'var(--v2-status-offer-bg)',
      border: 'var(--v2-status-offer-border)',
      text: 'var(--v2-status-offer-text)',
    },
    accepted: {
      bg: 'var(--v2-status-accepted-bg)',
      border: 'var(--v2-status-accepted-border)',
      text: 'var(--v2-status-accepted-text)',
    },
  },
  // Toast colors
  toast: {
    success: 'var(--v2-toast-success)',
    error: 'var(--v2-toast-error)',
    info: 'var(--v2-toast-info)',
    warning: 'var(--v2-toast-warning)',
  },
  // Success/Progress colors
  success: {
    primary: 'var(--v2-success-primary)',
  },
  // Destructive/Action colors
  destructive: {
    primary: 'var(--v2-destructive-primary)',
  },
  // Overlay
  overlay: 'var(--v2-overlay)',
  // Icon filters
  iconFilters: {
    primary: 'var(--v2-icon-filter-primary)',
    muted: 'var(--v2-icon-filter-muted)',
  },
} as const

// ============================================================================
// RAW COLOR VALUES (for cases where CSS variables can't be used)
// ============================================================================
// These are the actual hex values - use sparingly, prefer CSS variables

export const colorValues = {
  // Background colors
  background: {
    primary: '#151619',
    secondary: '#1d1f22',
    card: '#1a1b1e',
  },
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#a1a2a3',
    muted: '#898989',
    accent: '#7296ac',
    button: '#8aa8ba',
    caret: '#b6d8ff',
    error: '#d37e76',
    info: '#8aa8ba',
  },
  // Border colors
  border: {
    default: '#252628',
    light: '#8aa8ba',
    active: '#ffffff',
    error: '#592b26',
  },
  // Brand colors
  brand: {
    primary: '#145075',
  },
  // Status colors (matching CSS variables)
  status: {
    applied: {
      bg: '#1d1f22',
      border: '#252628',
      text: '#ffffff',
    },
    rejected: {
      bg: '#311614',
      border: '#592b26',
      text: '#d37e76',
    },
    interview: {
      bg: '#1f140d',
      border: '#4f3527',
      text: '#ddd2a3',
    },
    offer: {
      bg: '#112531',
      border: '#213d4e',
      text: '#368abe',
    },
    accepted: {
      bg: '#123520',
      border: '#386f4e',
      text: '#48ba77',
    },
  },
  // Success/Progress colors
  success: {
    primary: '#48ba77',
  },
  // Destructive/Action colors
  destructive: {
    primary: '#d73e3d',
  },
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.8)',
} as const

// ============================================================================
// ICON FILTERS (for converting white icons to specific colors)
// ============================================================================
// These CSS filters convert white (#ffffff) icons to specific colors
// Used when icons need to be colored but the SVG itself is white

export const iconFilters = {
  // Green check icon filter - converts white to #008000
  greenCheck: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)',
} as const
