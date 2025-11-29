'use client'

import React from 'react'

/**
 * Separator component for V2 design system
 * 
 * Matches Figma design specifications:
 * - Color: #252628 (--v2-border-default)
 * - Height: 1px
 * - Full width by default
 * 
 * @example
 * // Basic separator
 * <Separator />
 * 
 * @example
 * // Separator with custom className
 * <Separator className="my-4" />
 */
interface SeparatorProps {
  /**
   * Additional CSS classes to apply
   */
  className?: string
  /**
   * Custom width (defaults to full width)
   */
  width?: string
  /**
   * Custom color (defaults to --v2-border-default)
   */
  color?: string
}

export const Separator = React.memo(function Separator({
  className = '',
  width = '100%',
  color = 'var(--v2-border-default)'
}: SeparatorProps) {
  return (
    <div 
      className={`h-0 relative shrink-0 ${className}`}
      style={{ width }}
    >
      <div 
        className="absolute bottom-0 left-0 right-0 top-[-1px]"
        style={{
          borderTop: `1px solid ${color}`
        }}
      />
    </div>
  )
})

