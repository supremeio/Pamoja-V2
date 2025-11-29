'use client'

import React, { useEffect, useState, createContext, useContext, useCallback, ReactNode } from 'react'
import { typography } from '@/lib/typography/v2'

const fontMedium = typography.medium

// Icon assets from local icon library
const imgCheckIcon = "/icons/v2/check-icon.svg" // Check icon (success)
const imgErrorIcon = "/icons/v2/warning-icon.svg" // Danger icon (error & warning)
const imgInfoIcon = "/icons/v2/info-icon.svg" // Info circle icon (info)
const imgCloseIcon = "/icons/v2/close-icon.svg" // Close icon

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastData {
  id: string
  type: ToastType
  message: string
  duration?: number
  position?: {
    top?: number
    right?: number
  }
}

interface ToastProps {
  toast: ToastData
  onClose: (id: string) => void
}

const ToastComponent = React.memo(function ToastComponent({
  toast,
  onClose
}: ToastProps) {
  const { id, type, message, duration = 5000, position = { top: 80, right: 40 } } = toast
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Trigger animation after mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    })
  }, [])

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          setIsMounted(false)
          onClose(id)
        }, 300) // Wait for exit animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose, id])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      setIsMounted(false)
      onClose(id)
    }, 300)
  }

  if (!isMounted) {
    return null
  }

  const iconMap: Record<ToastType, string> = {
    success: imgCheckIcon,
    error: imgErrorIcon,
    info: imgInfoIcon,
    warning: imgErrorIcon // Warning uses the same danger icon as error
  }

  const typeStyles: Record<ToastType, React.CSSProperties> = {
    success: {
      backgroundColor: 'var(--v2-toast-success)'
    },
    error: {
      backgroundColor: 'var(--v2-toast-error)'
    },
    info: {
      backgroundColor: 'var(--v2-toast-info)'
    },
    warning: {
      backgroundColor: 'var(--v2-toast-warning)'
    }
  }

  // Icon structure differs: success uses overflow-clip with inset, others use relative with absolute contents
  const isSuccessIcon = type === 'success'

  const toastStyle: React.CSSProperties = {
    ...typeStyles[type],
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
    transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  }

  return (
    <div
      className="box-border content-stretch flex items-center justify-between p-[16px] rounded-[8px] w-[320px] relative"
      style={toastStyle}
    >
      <div className="content-stretch flex gap-[4px] items-end relative shrink-0">
        {isSuccessIcon ? (
          <div className="relative shrink-0 size-[20px]">
            <div className="absolute contents inset-0">
              <img alt="" className="block max-w-none size-full" src={iconMap[type]} style={{ filter: 'brightness(0) invert(1)', width: '16px', height: '16px' }} />
            </div>
          </div>
        ) : (
          <div className="relative shrink-0 size-[20px]">
            <div className="absolute contents inset-0">
              <img alt="" className="block max-w-none size-full" src={iconMap[type]} style={{ filter: 'brightness(0) invert(1)', width: '16px', height: '16px' }} />
            </div>
          </div>
        )}
        <p
          className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
          style={fontMedium}
        >
          {message}
        </p>
      </div>
      <div
        className="relative shrink-0 size-[20px] cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
        onClick={handleClose}
      >
        <img alt="" className="block max-w-none size-full" src={imgCloseIcon} style={{ filter: 'brightness(0) invert(1)', width: '16px', height: '16px' }} />
      </div>
    </div>
  )
})

// Toast Context and Provider
interface ToastContextType {
  showToast: (toast: Omit<ToastData, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed z-50" style={{ top: 80, right: 40 }}>
        <div className="content-stretch flex flex-col gap-[8px] items-end relative">
          {toasts.map(toast => (
            <ToastComponent
              key={toast.id}
              toast={toast}
              onClose={removeToast}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Convenience functions for direct toast creation
export const toast = {
  success: (message: string, duration?: number) => ({
    type: 'success' as const,
    message,
    duration
  }),
  error: (message: string, duration?: number) => ({
    type: 'error' as const,
    message,
    duration
  }),
  info: (message: string, duration?: number) => ({
    type: 'info' as const,
    message,
    duration
  }),
  warning: (message: string, duration?: number) => ({
    type: 'warning' as const,
    message,
    duration
  })
}

