'use client'

import React from 'react'
import { colorValues } from '@/lib/colors/v2'

// Icon assets from local icon library - using exact Figma icons
const imgCheckedIcon = "/icons/v2/checked box icon.svg"
const imgUncheckedIcon = "/icons/v2/Unchecked box icon.svg"
const imgIntermediateIcon = "/icons/v2/Intermediate checked icon.svg"

export type CheckboxState = 'checked' | 'unchecked' | 'intermediate'

interface CheckboxProps {
  checked?: boolean
  intermediate?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  disabled?: boolean
}

export const Checkbox = React.memo(function Checkbox({
  checked = false,
  intermediate = false,
  onChange,
  className = '',
  disabled = false
}: CheckboxProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled && onChange) {
      // If intermediate, toggle to checked; otherwise toggle checked state
      const newChecked = intermediate ? true : !checked
      onChange(newChecked)
    }
  }

  // Determine which icon to show based on state
  const getIcon = (): string => {
    if (intermediate) return imgIntermediateIcon
    if (checked) return imgCheckedIcon
    return imgUncheckedIcon
  }

  // Determine state for aria
  const ariaChecked = intermediate ? 'mixed' : checked

  return (
    <button
      className={`block cursor-pointer relative shrink-0 size-[24px] transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={handleClick}
      disabled={disabled}
      aria-checked={ariaChecked}
      role="checkbox"
      style={{
        willChange: 'transform, opacity',
        padding: 0,
        border: 'none',
        background: 'transparent',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img 
        alt="" 
        className="block max-w-none size-full" 
        src={getIcon()}
        style={{
          width: '24px',
          height: '24px',
          objectFit: 'contain'
        }}
      />
    </button>
  )
})

