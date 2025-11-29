'use client'

import { useCallback } from 'react'
import { typography } from '@/lib/typography/v2'
import { colorValues } from '@/lib/colors/v2'

const fontMedium = typography.medium

// Icon assets from local icon library
const imgOptimizeResume = "/icons/v2/optimize-icon.svg" // Optimize resume icon
const imgGenerateCoverLetter = "/icons/v2/cover-letter-icon.svg" // Generate cover letter icon
const imgAddApplication = "/icons/v2/applications-menu-icon.svg" // Add application icon

interface QuickActionMenuProps {
  isOpen: boolean
  onClose: () => void
  onItemClick?: (action: string) => void
  position?: { top: number; left: number }
}

export function QuickActionMenu({ isOpen, onClose, onItemClick, position = { top: 73, left: 1180 } }: QuickActionMenuProps) {
  const menuItems = [
    { id: 'optimize-resume', label: 'Optimize resume', icon: imgOptimizeResume, active: false },
    { id: 'generate-cover-letter', label: 'Generate cover letter', icon: imgGenerateCoverLetter, active: false },
    { id: 'add-application', label: 'Add application', icon: imgAddApplication, active: false },
  ]

  const handleItemClick = useCallback((id: string) => {
    onItemClick?.(id)
    onClose()
  }, [onItemClick, onClose])

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 z-40 transition-opacity duration-200 ease-in-out"
        style={{ backgroundColor: colorValues.overlay }}
        onClick={onClose}
      />
      <div 
        className="fixed bg-v2-background-primary border border-v2-border border-solid box-border content-stretch flex flex-col gap-[4px] items-start p-[16px] rounded-[12px] w-[228px] z-50 transition-all duration-200 ease-out"
        style={{ 
          top: `${position.top}px`, 
          left: `${position.left}px`,
          animation: 'menuSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`box-border content-stretch flex flex-col items-start justify-center px-[12px] py-[8px] relative shrink-0 w-full cursor-pointer transition-all duration-200 ease-out ${
              item.active 
                ? 'bg-v2-background-secondary rounded-[8px]' 
                : 'bg-v2-background-primary hover:bg-v2-background-secondary active:scale-[0.98] rounded-[8px]'
            }`}
            style={{ willChange: 'background-color, transform' }}
            onClick={() => handleItemClick(item.id)}
          >
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full group">
              <div className="relative shrink-0 size-[16px]">
                <img 
                  alt="" 
                  data-nav-icon
                  className="block max-w-none size-full" 
                  src={item.icon}
                  style={{
                    filter: item.active 
                      ? 'brightness(0) saturate(100%) invert(100%)' 
                      : 'brightness(0) saturate(100%) invert(54%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
                    transition: 'filter 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'filter',
                    width: '16px',
                    height: '16px'
                  }}
                />
              </div>
              <p 
                className={`leading-[1.7] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre transition-colors duration-200 ease-out ${item.active ? 'text-v2-text-primary' : 'text-v2-text-muted group-hover:text-v2-text-primary'}`}
                style={fontMedium}
              >
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

