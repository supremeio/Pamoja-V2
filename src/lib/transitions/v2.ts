/**
 * V2 Transition System
 * Centralized transition values matching CSS variables in globals.css
 */

export const transitions = {
  /** Duration values */
  duration: {
    /** 150ms - Fast transition */
    fast: '150ms',
    /** 200ms - Default transition */
    default: '200ms',
    /** 300ms - Slow transition */
    slow: '300ms',
  },
  /** Easing functions (matching CSS variables) */
  easing: {
    /** Standard easing */
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    /** Decelerate easing */
    decelerate: 'cubic-bezier(0.16, 1, 0.3, 1)',
    /** Smooth easing */
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  /** Pre-configured transition strings (matching CSS variables) */
  preset: {
    /** Fast transition */
    fast: 'var(--transition-fast)',
    /** Base transition */
    base: 'var(--transition-base)',
    /** Slow transition */
    slow: 'var(--transition-slow)',
    /** Smooth transition */
    smooth: 'var(--transition-smooth)',
  },
} as const

/**
 * Helper function to create transition strings
 */
export const createTransition = (
  properties: string[] = ['all'],
  duration: keyof typeof transitions.duration = 'default',
  easing: keyof typeof transitions.easing = 'standard'
): string => {
  const durationValue = transitions.duration[duration]
  const easingValue = transitions.easing[easing]
  return properties.map(prop => `${prop} ${durationValue} ${easingValue}`).join(', ')
}

