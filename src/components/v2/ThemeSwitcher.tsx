'use client'

import { useCallback, useMemo } from 'react'
import { typography } from '@/lib/typography/v2'
import { iconFilters } from '@/lib/colors/v2'

const fontMedium = typography.medium

// Icon assets
const imgCheckIcon = '/icons/v2/check-icon.svg'

type Theme = 'dark' | 'light' | 'system'

interface ThemeSwitcherProps {
  isOpen: boolean
  onClose: () => void
  currentTheme?: Theme
  onThemeChange?: (theme: Theme) => void
  position?: { top: number; left: number }
}

export function ThemeSwitcher({ 
  isOpen, 
  onClose, 
  currentTheme = 'dark',
  onThemeChange,
  position = { top: 73, left: 1090 } 
}: ThemeSwitcherProps) {
  const themes: { id: Theme; label: string }[] = [
    { id: 'dark', label: 'Dark' },
    { id: 'light', label: 'Light' },
    { id: 'system', label: 'System' },
  ]

  const handleThemeClick = useCallback((theme: Theme) => {
    // Temporarily disabled light theme
    if (theme === 'light') return
    
    if (theme !== currentTheme) {
      onThemeChange?.(theme)
    }
    onClose()
  }, [currentTheme, onThemeChange, onClose])

  const menuStyle = useMemo(() => ({
    top: `${position.top}px`,
    left: `${position.left}px`,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' as const : 'none' as const,
    visibility: isOpen ? 'visible' as const : 'hidden' as const,
  }), [position.top, position.left, isOpen])

  if (!isOpen) return null

  return (
    <div
      data-theme-menu
      className="fixed bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex flex-col gap-[4px] items-start p-[16px] rounded-[12px] w-[174px] z-[50] transition-opacity duration-300 ease-in-out"
      style={menuStyle}
      onClick={(e) => e.stopPropagation()}
    >
        {themes.map((theme) => {
          const isActive = currentTheme === theme.id
          const isComingSoon = theme.id === 'light'
          
          return (
            <div
              key={theme.id}
              className={`box-border content-stretch flex flex-col gap-[10px] items-start justify-center px-[12px] py-[8px] relative rounded-[4px] shrink-0 w-full cursor-pointer transition-all duration-200 ease-out ${
                isActive ? 'bg-v2-background-secondary' : ''
              } ${isComingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:bg-v2-background-secondary active:scale-[0.98]'} group`}
              style={{ willChange: 'background-color, transform' }}
              onClick={() => !isComingSoon && handleThemeClick(theme.id)}
              title={isComingSoon ? 'Coming soon' : ''}
            >
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <p 
                  className={`leading-[1.7] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre transition-colors duration-200 ease-out ${
                    isActive ? 'text-v2-text-primary' : 'text-v2-text-muted'
                  } ${!isComingSoon && !isActive ? 'group-hover:text-v2-text-primary' : ''}`}
                  style={fontMedium}
                >
                  {isComingSoon && (
                    <span className="absolute inset-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-v2-text-primary">
                      Coming soon
                    </span>
                  )}
                  <span className={`${isComingSoon ? 'group-hover:opacity-0 transition-opacity duration-200' : ''}`}>
                    {theme.label}
                  </span>
                </p>
                <div 
                  className={`overflow-clip relative shrink-0`}
                  style={{ 
                    width: '10.667px', 
                    height: '10.667px',
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <img 
                    alt="" 
                    className="block max-w-none size-full" 
                    src={imgCheckIcon}
                    style={{
                      filter: iconFilters.greenCheck,
                      width: '10.667px',
                      height: '10.667px'
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

