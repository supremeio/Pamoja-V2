'use client'

import { useCallback, useMemo } from 'react'
import { Separator } from './Separator'
import { typography } from '@/lib/typography/v2'
import { colorValues } from '@/lib/colors/v2'

const fontMedium = typography.medium

// Icon assets from local icon library
const imgCheckIcon = "/icons/v2/check-icon.svg" // Check icon for active status
const imgOptimizeIcon = "/icons/v2/optimize-icon.svg" // Compose reminder email icon (using optimize icon)
const imgDeleteIcon = "/icons/v2/delete-icon.svg" // Delete icon

// Icon filter for inactive state (matches SideNavigation inactiveFilter)
const inactiveFilter = 'brightness(0) saturate(100%) invert(54%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)'

interface ApplicationActionsMenuProps {
  isOpen: boolean
  onClose: () => void
  onStatusChange?: (status: string) => void
  onComposeReminder?: () => void
  onDeleteApplication?: () => void
  currentStatus?: string
  position?: { top: number; left: number }
}

const statusOptions = [
  { id: 'applied', label: 'Applied' },
  { id: 'interview', label: 'Interview' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'offer', label: 'Offer' },
  { id: 'accepted', label: 'Accepted' },
]

export function ApplicationActionsMenu({
  isOpen,
  onClose,
  onStatusChange,
  onComposeReminder,
  onDeleteApplication,
  currentStatus = 'applied',
  position = { top: 395, left: 1022 }
}: ApplicationActionsMenuProps) {
  const handleStatusClick = useCallback((statusId: string) => {
    if (statusId !== currentStatus) {
      onStatusChange?.(statusId)
    }
    onClose()
  }, [currentStatus, onStatusChange, onClose])

  const handleComposeReminder = useCallback(() => {
    onComposeReminder?.()
    onClose()
  }, [onComposeReminder, onClose])

  const handleDeleteApplication = useCallback(() => {
    onDeleteApplication?.()
    onClose()
  }, [onDeleteApplication, onClose])

  const menuStyle = useMemo(() => ({
    top: `${position.top}px`,
    left: `${position.left}px`,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' as const : 'none' as const,
    visibility: isOpen ? 'visible' as const : 'hidden' as const,
  }), [position.top, position.left, isOpen])

  return (
    <div
      data-application-menu
      className="fixed bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] rounded-[12px] z-[50] transition-opacity duration-300 ease-in-out"
      style={menuStyle}
      onClick={(e) => e.stopPropagation()}
    >
        {/* Status section */}
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          {statusOptions.map((status) => {
            const isActive = status.id === currentStatus
            return (
              <div
                key={status.id}
                className={`box-border content-stretch flex flex-col gap-[10px] items-start justify-center px-[12px] py-[8px] relative rounded-[4px] shrink-0 w-[210px] cursor-pointer transition-all duration-200 ease-out ${
                  isActive ? 'bg-v2-background-secondary' : ''
                } hover:bg-v2-background-secondary active:scale-[0.98] group`}
                style={{ willChange: 'background-color, transform' }}
                onClick={() => handleStatusClick(status.id)}
              >
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                  <p
                    className={`leading-[1.7] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre transition-colors duration-200 ease-out ${
                      isActive ? 'text-v2-text-primary' : 'text-v2-text-muted group-hover:text-v2-text-primary'
                    }`}
                    style={fontMedium}
                  >
                    {status.label}
                  </p>
                  <div
                    className={`relative shrink-0 size-[16px] transition-opacity duration-200 ease-in-out ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img alt="" className="block max-w-none size-full" src={imgCheckIcon} style={{ width: '16px', height: '16px' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* Divider */}
        <Separator />
        {/* Actions section */}
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
          <div 
            className="bg-v2-background-secondary box-border content-stretch flex flex-col gap-[10px] items-start justify-center px-[12px] py-[8px] relative rounded-[4px] shrink-0 w-[210px] cursor-pointer transition-all duration-200 ease-out active:scale-[0.98] group"
            style={{ willChange: 'background-color, transform' }}
          >
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" onClick={handleComposeReminder}>
              <div className="relative shrink-0 size-[16px]">
                <img 
                  alt="" 
                  data-nav-icon
                  className="block max-w-none size-full" 
                  src={imgOptimizeIcon} 
                  style={{ 
                    filter: inactiveFilter,
                    transition: 'filter 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'filter',
                    width: '16px',
                    height: '16px'
                  }}
                />
              </div>
              <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-muted group-hover:text-v2-text-primary text-nowrap whitespace-pre transition-colors duration-200 ease-out" style={fontMedium}>
                Compose reminder email
              </p>
            </div>
          </div>
          <div 
            className="bg-v2-background-secondary box-border content-stretch flex flex-col gap-[10px] items-start justify-center px-[12px] py-[8px] relative rounded-[4px] shrink-0 w-[210px] cursor-pointer transition-all duration-200 ease-out active:scale-[0.98] group"
            style={{ willChange: 'background-color, transform' }}
          >
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" onClick={handleDeleteApplication}>
              <div className="relative shrink-0 size-[16px]">
                <img 
                  alt="" 
                  data-delete-icon
                  className="block max-w-none size-full" 
                  src={imgDeleteIcon}
                  style={{
                    filter: 'none',
                    transition: 'filter 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'filter',
                    width: '16px',
                    height: '16px'
                  }}
                />
              </div>
              <p className="leading-[1.7] not-italic relative shrink-0 group-hover:text-v2-text-primary text-[14px] text-nowrap whitespace-pre transition-colors duration-200 ease-out" style={{ ...fontMedium, color: colorValues.text.error }}>
                Delete application
              </p>
            </div>
          </div>
        </div>
    </div>
  )
}

