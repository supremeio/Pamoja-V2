'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { typography } from '@/lib/typography/v2'
import { Separator } from './Separator'

const fontMedium = typography.medium

// Icon assets from local icon library
const img = "/icons/v2/dashboard-icon.svg" // Dashboard icon
const img1 = "/icons/v2/applications-menu-icon.svg" // Applications icon
const img2 = "/icons/v2/documents-icon.svg" // Toolkit icon
const img3 = "/icons/v2/email-icon.svg" // Contact us/email icon

const activeFilter = 'brightness(0) saturate(100%) invert(100%)'
const inactiveFilter = 'brightness(0) saturate(100%) invert(54%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)'

/**
 * Props for SideNavigation component
 */
interface SideNavigationProps {
  /** Additional CSS classes */
  className?: string
  /** User's display name */
  userName?: string
  /** User's email address */
  email?: string
}

/**
 * SideNavigation component - Main navigation sidebar for V2 interface
 * 
 * Features:
 * - Active route highlighting
 * - Smooth transitions
 * - Accessible navigation links
 * 
 * @example
 * ```tsx
 * <SideNavigation 
 *   userName="John Doe"
 *   email="john@example.com"
 * />
 * ```
 */
export const SideNavigation = React.memo(function SideNavigation({ 
  className = '', 
  userName = 'Oluwatosin',
  email = 'supremeux@gmail.com'
}: SideNavigationProps) {
  const pathname = usePathname()
  const { isDashboard, isApplications, isToolkit } = useMemo(() => {
    if (!pathname) return { isDashboard: false, isApplications: false, isToolkit: false }
    return {
      isDashboard: pathname === '/v2/dashboard',
      isApplications: pathname === '/v2/applications',
      isToolkit: pathname === '/v2/toolkit'
    }
  }, [pathname])

  return (
    <div className={className}>
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary tracking-[-0.14px] w-full" style={fontMedium}>
          Hello, {userName}
        </p>
        <div className="content-stretch flex gap-[2px] items-center relative shrink-0 w-full">
          <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-muted text-nowrap whitespace-pre" style={fontMedium}>
            {email}
          </p>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          <Link 
            href="/v2/dashboard" 
            className="w-full cursor-pointer block group" 
            prefetch={true}
            aria-label="Navigate to Dashboard"
            aria-current={isDashboard ? 'page' : undefined}
          >
            <div className={`box-border content-stretch flex flex-col items-start justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full transition-all duration-200 ease-out ${
              isDashboard 
                ? 'bg-v2-background-secondary' 
                : 'bg-v2-background-primary hover:bg-v2-background-secondary active:scale-[0.98]'
            }`} style={{ willChange: 'background-color, transform' }}>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full pointer-events-none">
                <div className="relative shrink-0 size-[20px]">
                  <img 
                    alt="" 
                    data-nav-icon
                    className="block max-w-none size-full" 
                    src={img}
                    style={{
                      filter: isDashboard ? activeFilter : inactiveFilter,
                      transition: 'filter 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'filter',
                      width: '20px',
                      height: '20px'
                    }}
                  />
                </div>
                <p className={`leading-[1.7] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre transition-colors duration-200 ease-out ${
                  isDashboard ? 'text-v2-text-primary' : 'text-v2-text-muted group-hover:text-v2-text-primary'
                }`} style={fontMedium}>
                  Dashboard
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/v2/applications" 
            className="w-full cursor-pointer block group" 
            prefetch={true}
            aria-label="Navigate to Applications"
            aria-current={isApplications ? 'page' : undefined}
          >
            <div className={`box-border content-stretch flex flex-col items-start justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full transition-all duration-200 ease-out ${
              isApplications 
                ? 'bg-v2-background-secondary' 
                : 'bg-v2-background-primary hover:bg-v2-background-secondary active:scale-[0.98]'
            }`} style={{ willChange: 'background-color, transform' }}>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full pointer-events-none">
                <div className="relative shrink-0 size-[20px]">
                  <img 
                    alt="" 
                    data-nav-icon
                    className="block max-w-none size-full" 
                    src={img1}
                    style={{
                      filter: isApplications ? activeFilter : inactiveFilter,
                      transition: 'filter 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'filter',
                      width: '20px',
                      height: '20px'
                    }}
                  />
                </div>
                <p className={`leading-[1.7] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre transition-colors duration-200 ease-out ${
                  isApplications ? 'text-v2-text-primary' : 'text-v2-text-muted group-hover:text-v2-text-primary'
                }`} style={fontMedium}>
                  Applications
                </p>
              </div>
            </div>
          </Link>
          <Link 
            href="/v2/toolkit" 
            className="w-full cursor-pointer block group" 
            prefetch={true}
            aria-label="Navigate to Toolkit"
            aria-current={isToolkit ? 'page' : undefined}
          >
            <div className={`box-border content-stretch flex flex-col items-start justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full transition-all duration-200 ease-out ${
              isToolkit 
                ? 'bg-v2-background-secondary' 
                : 'bg-v2-background-primary hover:bg-v2-background-secondary active:scale-[0.98]'
            }`} style={{ willChange: 'background-color, transform' }}>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full pointer-events-none">
                <div className="relative shrink-0 size-[20px]">
                  <img 
                    alt="" 
                    data-nav-icon
                    className="block max-w-none size-full" 
                    src={img2}
                    style={{
                      filter: isToolkit ? activeFilter : inactiveFilter,
                      transition: 'filter 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'filter',
                      width: '20px',
                      height: '20px'
                    }}
                  />
                </div>
                <p className={`leading-[1.7] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre transition-colors duration-200 ease-out ${
                  isToolkit ? 'text-v2-text-primary' : 'text-v2-text-muted group-hover:text-v2-text-primary'
                }`} style={fontMedium}>
                  Toolkit
                </p>
              </div>
            </div>
          </Link>
        </div>
        <Separator />
        <a 
          href="mailto:oluwatosinsamk@gmail.com" 
          className="w-full cursor-pointer block group"
          aria-label="Contact us via email"
        >
          <div className="bg-v2-background-primary hover:bg-v2-background-secondary box-border content-stretch flex flex-col gap-[10px] items-start justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full transition-all duration-200 ease-out active:scale-[0.98]" style={{ willChange: 'background-color, transform' }}>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full pointer-events-none">
              <div className="relative shrink-0 size-[20px]">
                  <img 
                    alt="" 
                    data-nav-icon
                    className="block max-w-none size-full" 
                    src={img3}
                    style={{
                      filter: inactiveFilter,
                      transition: 'filter 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'filter',
                      width: '20px',
                      height: '20px'
                    }}
                  />
              </div>
              <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-muted group-hover:text-v2-text-primary text-nowrap whitespace-pre transition-colors duration-200 ease-out" style={fontMedium}>
                Contact us
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
})

