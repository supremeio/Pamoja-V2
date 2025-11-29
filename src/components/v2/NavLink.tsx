'use client'

import React from 'react'
import Link from 'next/link'

/**
 * Reusable NavLink component that ensures proper clickability
 * 
 * Best practices:
 * - Always use this component for navigation links in V2
 * - Child elements automatically get pointer-events-none to prevent click blocking
 * - Includes cursor-pointer and block display for proper styling
 * 
 * @example
 * <NavLink href="/v2/dashboard" className="...">
 *   <div className="...">
 *     <Icon />
 *     <span>Dashboard</span>
 *   </div>
 * </NavLink>
 */
interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  active?: boolean
  onClick?: () => void
}

export const NavLink = React.memo(function NavLink({
  href,
  children,
  className = '',
  active: _active = false,
  onClick
}: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className={`w-full cursor-pointer block ${className}`}
      onClick={onClick}
    >
      <div className="pointer-events-none">
        {children}
      </div>
    </Link>
  )
})

