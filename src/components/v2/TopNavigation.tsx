'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { QuickActionMenu } from './QuickActionMenu'
import { ThemeSwitcher } from './ThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { typography } from '@/lib/typography/v2'

const fontMedium = typography.medium

// Icon assets from local icon library
const imgVuesaxBoldNote2 = "/icons/v2/pamoja-logo.svg" // Pamoja logo
const imgEllipse1 = "/icons/v2/avatar.png" // Avatar image
const imgQuickActionIcon = "/icons/v2/quick-icon.svg" // Quick action icon
const imgMoonIcon = "/icons/v2/moon-icon.svg" // Moon icon for theme switcher

interface TopNavigationProps {
  className?: string
  onQuickActionClick?: () => void
  onAvatarClick?: () => void
  avatarImage?: string
  onMenuItemClick?: (action: string) => void
}

export const TopNavigation = React.memo(function TopNavigation({ 
  className = '',
  onQuickActionClick,
  onAvatarClick,
  avatarImage,
  onMenuItemClick
}: TopNavigationProps) {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)
  const themeButtonRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 73, left: 1180 })
  const [themeMenuPosition, setThemeMenuPosition] = useState({ top: 73, left: 1090 })

  useEffect(() => {
    const handleResize = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setMenuPosition({
          top: rect.bottom + 9,
          left: rect.right - 228
        })
      }
      if (themeButtonRef.current) {
        const rect = themeButtonRef.current.getBoundingClientRect()
        setThemeMenuPosition({
          top: rect.bottom + 9,
          left: rect.right - 174
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleButtonClick = useCallback(() => {
    setIsMenuOpen(prev => {
    onQuickActionClick?.()
      return !prev
    })
  }, [onQuickActionClick])

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const handleMenuItemClick = useCallback((action: string) => {
    onMenuItemClick?.(action)
    setIsMenuOpen(false)
  }, [onMenuItemClick])

  const handleThemeButtonClick = useCallback(() => {
    setIsThemeMenuOpen(prev => !prev)
  }, [])

  const handleThemeMenuClose = useCallback(() => {
    setIsThemeMenuOpen(false)
  }, [])

  // Handle click outside for theme menu (same pattern as ApplicationActionsMenu)
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (isThemeMenuOpen && themeButtonRef.current) {
        const target = event.target as Node
        if (!themeButtonRef.current.contains(target)) {
          const menuElement = document.querySelector('[data-theme-menu]')
          if (!menuElement || !menuElement.contains(target)) {
            setIsThemeMenuOpen(false)
          }
        }
      }
    },
    [isThemeMenuOpen]
  )

  useEffect(() => {
    if (isThemeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside, true)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true)
      }
    }
  }, [isThemeMenuOpen, handleClickOutside])

  return (
    <>
      <div className={`box-border content-stretch flex items-start justify-between px-[40px] py-[24px] relative shrink-0 w-full ${className}`}>
        <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
          <div className="relative shrink-0 h-[24px] w-auto">
            <img alt="Pamoja logo" className="block max-w-none h-full w-auto" src={imgVuesaxBoldNote2} />
          </div>
        </div>
        <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0 w-[765.5px]">
          <div 
            ref={themeButtonRef}
            className="relative shrink-0 size-[24px] cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 focus:outline-none"
            onClick={handleThemeButtonClick}
          >
            <img 
              alt="Theme switcher" 
              className="block max-w-none size-full" 
              src={imgMoonIcon}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <div 
            ref={buttonRef}
            className="bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:bg-v2-background-primary hover:scale-[1.02] active:scale-[0.98] active:opacity-90 focus:outline-none"
            onClick={handleButtonClick}
          >
            <div className="relative shrink-0 size-[20px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={imgQuickActionIcon} style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
            </div>
            <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              Quick action
            </p>
          </div>
          <div 
            className="relative shrink-0 size-[40px] cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 hover:ring-2 hover:ring-v2-border-light active:scale-95 rounded-full overflow-hidden"
            onClick={onAvatarClick}
          >
            <img 
              alt="" 
              className="block max-w-none size-full" 
              height="40" 
              src={avatarImage || imgEllipse1} 
              width="40" 
            />
          </div>
        </div>
      </div>
      <QuickActionMenu 
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
        onItemClick={handleMenuItemClick}
        position={menuPosition}
      />
      <ThemeSwitcher 
        isOpen={isThemeMenuOpen}
        onClose={handleThemeMenuClose}
        currentTheme={theme}
        onThemeChange={setTheme}
        position={themeMenuPosition}
      />
    </>
  )
})

