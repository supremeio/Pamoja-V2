'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { InputProps as ShadcnInputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { typography } from '@/lib/typography/v2'
import { colors } from '@/lib/colors/v2'
import { createTransition } from '@/lib/transitions/v2'

const fontMedium = typography.medium
const fontRegular = typography.regular

// Icon assets from local icon library
const imgDropdownIcon = "/icons/v2/dropdown-icon.svg"
const imgCheckIcon = "/icons/v2/check-icon.svg"
const imgErrorIcon = "/icons/v2/warning-icon.svg"

export interface TextFieldProps extends Omit<ShadcnInputProps, 'onChange' | 'onFocus' | 'onBlur' | 'value' | 'defaultValue' | 'type'> {
  label?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  error?: string
  helperText?: string
  type?: 'text' | 'textarea'
  variant?: 'default' | 'dropdown' | 'country-selection'
  showClearButton?: boolean
  showIcon?: boolean
  showHelperText?: boolean
  className?: string
  width?: string
  dropdownOptions?: Array<{ label: string; value: string }>
  onDropdownSelect?: (value: string) => void
}

export function TextField({
  label = 'Label',
  placeholder = 'Placeholder',
  value: controlledValue,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  error,
  helperText,
  disabled = false,
  readOnly = false,
  type = 'text',
  variant = 'default',
  showClearButton = true,
  showIcon = true,
  showHelperText = false,
  className = '',
  width = '375px',
  dropdownOptions,
  onDropdownSelect
}: TextFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showAllOptions, setShowAllOptions] = useState(false)
  
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isFocusedRef = useRef(false)
  const closingTimeoutRef = useRef<NodeJS.Timeout>()

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const hasValue = value.length > 0

  // Get display value - show label for dropdown options, otherwise show value
  const displayValue = useMemo(() => {
    if (!dropdownOptions || variant !== 'dropdown' || !value) {
      return value
    }
    // Find matching option and return its label
    const matchingOption = dropdownOptions.find(option => option.value === value)
    return matchingOption ? matchingOption.label : value
  }, [value, dropdownOptions, variant])

  // Filter dropdown options based on input value (for search functionality)
  const filteredDropdownOptions = useMemo(() => {
    if (!dropdownOptions || variant !== 'dropdown') {
      return dropdownOptions || []
    }
    // Show all options when opened via icon click (after selection)
    if (showAllOptions) {
      return dropdownOptions
    }
    if (!value) {
      return dropdownOptions
    }
    
    // Use displayValue for searching (what user sees/typed) to allow searching by label
    const searchTerm = displayValue.toLowerCase().trim()
    if (!searchTerm) {
      return dropdownOptions
    }
    return dropdownOptions.filter(option =>
      option.label.toLowerCase().includes(searchTerm) ||
      option.value.toLowerCase().includes(searchTerm)
    )
  }, [dropdownOptions, value, variant, showAllOptions, displayValue])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const typedText = e.target.value
    
    // For dropdown variants, if typed text exactly matches a label, use the corresponding value
    // Otherwise, use the typed text as-is (for searching)
    let newValue = typedText
    if ((variant === 'dropdown' || variant === 'country-selection') && dropdownOptions) {
      const exactMatch = dropdownOptions.find(option => option.label === typedText)
      if (exactMatch) {
        newValue = exactMatch.value
      }
    }
    
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
    setIsTyping(true)
    
    // Clear showAllOptions when user starts typing
    setShowAllOptions(false)
    
    // Auto-open dropdown when typing in dropdown variant
    if ((variant === 'dropdown' || variant === 'country-selection') && dropdownOptions && dropdownOptions.length > 0) {
      setShowDropdown(true)
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 500)
  }, [controlledValue, onChange, variant, dropdownOptions])

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true
    setIsFocused(true)
    // Auto-open dropdown on focus for dropdown variants
    if ((variant === 'dropdown' || variant === 'country-selection') && dropdownOptions && dropdownOptions.length > 0) {
      setShowDropdown(true)
    }
    onFocus?.()
  }, [onFocus, variant, dropdownOptions])

  const handleBlur = useCallback((_e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTimeout(() => {
      const activeElement = document.activeElement
      const container = containerRef.current
      const dropdown = dropdownRef.current
      const isFocusWithin = container?.contains(activeElement) || dropdown?.contains(activeElement)
      
      if (!isFocusWithin) {
          isFocusedRef.current = false
          setIsFocused(false)
          setIsTyping(false)
      }
      
      onBlur?.()
    }, 0)
  }, [onBlur])

  const handleClear = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue('')
    }
    onChange?.('')
    inputRef.current?.focus()
  }, [controlledValue, onChange])

  const closeDropdown = useCallback(() => {
    setIsClosing(true)
    setShowAllOptions(false)
    if (closingTimeoutRef.current) {
      clearTimeout(closingTimeoutRef.current)
    }
    // Wait for animation to complete before removing from DOM
    closingTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false)
      setIsClosing(false)
    }, 300) // Match transition duration
  }, [])

  const handleIconClick = useCallback(() => {
    // Don't allow interaction when disabled or readOnly
    if (disabled || readOnly) {
      return
    }
    
    if (dropdownOptions && dropdownOptions.length > 0) {
      if (showDropdown) {
        closeDropdown()
        setShowAllOptions(false)
      } else {
        // If there's a value, select all text and show all options
        if (hasValue && inputRef.current) {
          if (inputRef.current instanceof HTMLInputElement) {
            inputRef.current.select()
          }
          setShowAllOptions(true)
        } else {
          setShowAllOptions(false)
        }
        setShowDropdown(true)
        setIsClosing(false)
      }
    } else if (hasValue && showClearButton && !readOnly && !disabled) {
      handleClear()
    }
  }, [dropdownOptions, hasValue, showClearButton, readOnly, disabled, handleClear, showDropdown, closeDropdown])

  const handleDropdownSelect = useCallback((option: { label: string; value: string }) => {
    if (controlledValue === undefined) {
      setInternalValue(option.value)
    }
    onChange?.(option.value)
    onDropdownSelect?.(option.value)
    
    // Reset showAllOptions when selection is made
    setShowAllOptions(false)
    
    // Close dropdown immediately with smooth animation
    closeDropdown()
    
    // Focus after a small delay to ensure smooth transition
    setTimeout(() => {
    inputRef.current?.focus()
    }, 100)
  }, [controlledValue, onChange, onDropdownSelect, closeDropdown])

  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || readOnly) return
    
    const target = e.target as HTMLElement
    const isIconClick = target.closest('[data-icon-container]')
    const isInputClick = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
    const isDropdownClick = target.closest('[data-dropdown-menu]')
    
    // If it's a dropdown variant, open dropdown when clicking the container
    if (variant === 'dropdown' && dropdownOptions?.length && !isIconClick && !isInputClick && !isDropdownClick) {
      if (!showDropdown) {
        // If there's a value, select all text and show all options
        if (hasValue && inputRef.current) {
          if (inputRef.current instanceof HTMLInputElement) {
            inputRef.current.select()
          }
          setShowAllOptions(true)
        } else {
          setShowAllOptions(false)
        }
        setShowDropdown(true)
        setIsClosing(false)
      }
    }
    
    if (!isIconClick && !isInputClick && !isDropdownClick && inputRef.current) {
      e.preventDefault()
      e.stopPropagation()
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
  }
  }, [disabled, readOnly, variant, dropdownOptions, showDropdown, hasValue])

  const handleContainerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || readOnly) return
    
    const target = e.target as HTMLElement
    const isIconClick = target.closest('[data-icon-container]')
    const isInputClick = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
    
    if (!isIconClick && !isInputClick && inputRef.current) {
      e.preventDefault()
      inputRef.current.focus()
    }
  }, [disabled, readOnly])

  useEffect(() => {
    if (!isFocused) {
      return
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const container = containerRef.current
      const dropdown = dropdownRef.current
      
      const isOutsideContainer = container && !container.contains(target)
      const isOutsideDropdown = !dropdown || !dropdown.contains(target)
      
      if (isOutsideContainer && isOutsideDropdown) {
          isFocusedRef.current = false
          setIsFocused(false)
          setIsTyping(false)
        closeDropdown()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [isFocused, closeDropdown])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (closingTimeoutRef.current) {
        clearTimeout(closingTimeoutRef.current)
      }
    }
  }, [])

  const state = error 
    ? 'error'
    : readOnly || disabled
    ? 'read-only'
    : isTyping && isFocused && hasValue
    ? 'typing'
    : isFocused && !hasValue
    ? 'active'
    : hasValue
    ? 'filled'
    : 'default'

  const getIcon = () => {
    if (state === 'error') return imgErrorIcon
    // For dropdown variants, always show dropdown icon (check icon only shows in dropdown menu items)
    if (variant === 'dropdown' || variant === 'country-selection') return imgDropdownIcon
    if (state === 'filled') return imgCheckIcon
    return imgDropdownIcon
  }

  const icon = getIcon()

  const renderIcon = () => {
    if (!showIcon) return null
    
    // Match disabled text opacity (typically 0.5 for disabled state)
    const iconOpacity = disabled || readOnly ? 0.5 : 1
    
    return (
      <div 
        data-icon-container
        className={cn(
          "relative shrink-0 size-[20px] flex items-center justify-center transition-all duration-200 ease-in-out z-40",
          !readOnly && !disabled && (dropdownOptions?.length || (hasValue && showClearButton)) && "cursor-pointer hover:opacity-80 active:opacity-60"
        )}
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled && !readOnly) {
            handleIconClick()
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
        style={{
          transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: disabled || readOnly ? 'none' : 'auto'
        }}
      >
        <img 
          alt="" 
          className="block max-w-none size-full transition-opacity duration-200 ease-in-out" 
          src={icon}
          style={{
            opacity: iconOpacity
          }}
        />
      </div>
    )
  }

  const renderDropdownMenu = () => {
    if (!showDropdown || !filteredDropdownOptions?.length) return null

    const isVisible = showDropdown && !isClosing

    return (
      <div 
        ref={dropdownRef}
        data-dropdown-menu
        className={cn(
          "v2-scrollbar bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex flex-col gap-[4px] items-start px-[12px] py-[16px] absolute rounded-[12px] w-full max-h-[200px] transition-all duration-300 ease-out z-50",
          isVisible ? "overflow-y-auto" : "overflow-hidden"
        )}
        style={{
          top: 'calc(100% + 4px)',
          left: 0,
          opacity: isVisible ? 1 : 0,
          maxHeight: isVisible ? '200px' : '0px',
          transform: isVisible ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: isVisible ? 'auto' as const : 'none' as const,
          visibility: showDropdown ? 'visible' as const : 'hidden' as const,
          willChange: 'opacity, max-height, transform'
        }}
      >
        {filteredDropdownOptions.map((option) => {
          const isSelected = value === option.value
          return (
          <div
            key={option.value}
              className={`box-border content-stretch flex flex-col gap-[10px] items-start justify-center px-[12px] py-[8px] relative rounded-[4px] shrink-0 w-full cursor-pointer transition-all duration-200 ease-out ${
                isSelected ? 'bg-v2-background-secondary' : ''
              } hover:bg-v2-background-secondary active:scale-[0.98] group`}
              style={{ willChange: 'background-color, transform' }}
            onClick={() => handleDropdownSelect(option)}
            >
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <p 
                  className={`leading-[1.7] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre transition-colors duration-200 ease-out ${
                    isSelected ? 'text-v2-text-primary' : 'text-v2-text-muted group-hover:text-v2-text-primary'
                  }`}
            style={fontMedium}
          >
            {option.label}
                </p>
                <div
                  className={`relative shrink-0 size-[16px] transition-opacity duration-200 ease-in-out ${
                    isSelected ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img alt="" className="block max-w-none size-full" src={imgCheckIcon} />
                </div>
              </div>
          </div>
          )
        })}
      </div>
    )
  }

  // Determine border color based on state
  const getBorderColor = () => {
    if (error) return colors.text.error
    if (isFocused) return colors.border.active
    return colors.border.default
  }

  // Determine background color
  const getBackgroundColor = () => {
    if (readOnly || disabled) return colors.background.secondary
    return colors.background.primary
  }

  // Determine placeholder/text color and opacity
  const getTextColor = () => {
    if (hasValue) return colors.text.primary
    if (isFocused && !hasValue) {
      return colors.text.muted // placeholder when focused
    }
    if (isHovered && !hasValue) {
      return colors.text.primary // placeholder when hovered
    }
    return colors.text.muted // default placeholder
  }

  const getTextOpacity = () => {
    if (hasValue) return 1
    if (isFocused && !hasValue) return 0.3
    if (isHovered && !hasValue) return 0.5
    return 0.3
  }

  // Textarea variant
  if (type === 'textarea') {
    const maxLines = 5
    const lineHeight = 20
    const maxHeight = maxLines * lineHeight // 100px for 5 lines
    
    return (
      <div 
        ref={containerRef}
      className={cn(
          'content-stretch flex flex-col gap-[8px] items-start relative',
        width === '100%' ? 'w-full' : '',
        className
      )}
        style={{ width }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Label + Input Frame */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          {/* Label */}
          <p 
            className="font-['Figtree:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-muted w-full"
            style={fontMedium}
          >
            {label}
          </p>

          {/* Textarea Frame */}
          <div 
            className={cn(
              'bg-v2-background-primary border border-solid relative rounded-[6px] shrink-0 w-full transition-all duration-200 ease-in-out',
              variant === 'dropdown' || variant === 'country-selection' ? 'cursor-pointer' : ''
            )}
            style={{
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
              transition: 'border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              minHeight: `${maxHeight + 32}px` // 120px content + 32px padding (16px top + 16px bottom)
            }}
            onClick={handleContainerClick}
            onMouseDown={handleContainerMouseDown}
          >
            <div className="box-border content-stretch flex gap-[12px] items-start overflow-clip p-[16px] relative rounded-[inherit] w-full">
              {/* Textarea Content */}
              <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start min-h-px min-w-px overflow-clip relative shrink-0">
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={displayValue || ''}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled || readOnly}
                  placeholder={placeholder}
                className={cn(
                    "v2-scrollbar font-['Figtree:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] tracking-[-0.14px]",
                    "bg-transparent border-none outline-none w-full min-w-0 resize-none",
                  "focus:ring-0 focus:ring-transparent focus:border-none focus:outline-none !shadow-none",
                    "cursor-text placeholder:text-v2-text-secondary placeholder:opacity-30",
                    readOnly || disabled ? "cursor-default" : ""
                  )}
                style={{
                  ...fontMedium,
                    color: hasValue ? colors.text.primary : getTextColor(),
                    opacity: hasValue ? 1 : getTextOpacity(),
                    caretColor: isTyping && hasValue ? colors.text.caret : colors.text.primary,
                    transition: createTransition(['color', 'opacity']),
                    minHeight: `${lineHeight}px`,
                    maxHeight: `${maxHeight}px`,
                    height: 'auto',
                    overflowY: 'auto',
                    padding: 0,
                    margin: 0,
                  width: '100%',
                    lineHeight: '20px'
                  }}
                  rows={5}
                  autoComplete="off"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                }}
              />
      </div>

              {/* Right Content - Icon */}
              {showIcon && renderIcon()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main text field component
  return (
    <div 
      ref={containerRef}
      className={cn(
        'content-stretch flex flex-col gap-[8px] items-start relative',
        width === '100%' ? 'w-full' : '',
        className
      )}
      style={{ width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Label + Input Frame */}
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
        {/* Label */}
        {label && (
          <p 
            className="font-['Figtree:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-muted w-full"
            style={fontMedium}
          >
            {label}
          </p>
        )}

        {/* Input Frame */}
        <div 
          className={cn(
            'bg-v2-background-primary border border-solid h-[56px] relative rounded-[6px] shrink-0 w-full transition-all duration-200 ease-in-out',
            variant === 'dropdown' || variant === 'country-selection' ? 'cursor-pointer' : ''
          )}
          style={{
            position: 'relative',
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: '1px',
            borderStyle: 'solid',
            transition: 'border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxSizing: 'border-box',
            overflow: 'visible',
            zIndex: showDropdown ? 10 : 'auto'
          }}
          onClick={handleContainerClick}
          onMouseDown={handleContainerMouseDown}
        >
          <div className="box-border content-stretch flex gap-[12px] h-[56px] items-center overflow-clip p-[16px] relative rounded-[inherit] w-full">
            {/* Left Content */}
            <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px overflow-clip relative shrink-0">
              {/* Input element */}
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
                value={displayValue || ''}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled || readOnly}
                placeholder={placeholder}
              className={cn(
                  "font-['Figtree:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[15px] tracking-[-0.15px]",
                  "bg-transparent border-none outline-none w-full min-w-0",
                "focus:ring-0 focus:ring-transparent focus:border-none focus:outline-none !shadow-none",
                  "cursor-text placeholder:text-v2-text-secondary placeholder:opacity-30",
                  readOnly || disabled ? "cursor-default" : ""
                )}
              style={{
                ...fontMedium,
                  color: hasValue ? colors.text.primary : getTextColor(),
                  opacity: hasValue ? 1 : getTextOpacity(),
                  caretColor: isTyping && hasValue ? colors.text.caret : colors.text.primary,
                  transition: createTransition(['color', 'opacity'])
                }}
                autoComplete="off"
                onClick={(e) => {
                  e.stopPropagation()
                }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                }}
              />
            </div>

            {/* Right Content - Icon */}
            {showIcon && renderIcon()}
          </div>
        </div>
        
        {/* Dropdown Menu - 4px below Input Frame */}
        {renderDropdownMenu()}
      </div>

      {/* Helper Text or Error Text */}
      {(showHelperText || error) && (
        <p 
          className={cn(
            "font-['Figtree:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] w-full",
            error ? "text-v2-status-error" : "text-v2-text-muted opacity-60"
          )}
          style={error ? fontRegular : fontMedium}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
}
