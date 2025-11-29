'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { typography } from '@/lib/typography/v2'
import { colorValues } from '@/lib/colors/v2'
import { spacing } from '@/lib/spacing/v2'
import { sizes } from '@/lib/sizing/v2'
import { createTransition } from '@/lib/transitions/v2'

const fontMedium = typography.medium
const fontSemibold = typography.semibold

// Icon assets from local icon library
const imgCloseIcon = "/icons/v2/close-icon.svg" // Close icon
const imgCheckIcon = "/icons/v2/check-icon.svg"
const imgLoadingIcon = "/icons/v2/loader-icon.svg"

interface ProcessItem {
  id: string
  label: string
  status: 'completed' | 'loading' | 'pending'
}

interface LoadingModalProps {
  isOpen: boolean
  onClose?: () => void
  onComplete?: () => void
  processes?: ProcessItem[]
  title?: string
  description?: string
  showOverlay?: boolean
}

export function LoadingModal({
  isOpen,
  onClose,
  onComplete,
  processes: initialProcesses = [
    { id: '1', label: 'Process 1', status: 'loading' },
    { id: '2', label: 'Process 2', status: 'pending' },
    { id: '3', label: 'Process 3', status: 'pending' }
  ],
  title = 'Optimizing your application',
  description = 'Every setback is a setup for a comeback. Keep pushing forward!',
  showOverlay = true
}: LoadingModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [processes, setProcesses] = useState(initialProcesses)
  const processesRef = useRef(processes)

  // Update ref when processes change
  useEffect(() => {
    processesRef.current = processes
  }, [processes])

  // Find the current loading process index
  const currentLoadingIndex = processes.findIndex(p => p.status === 'loading')
  const completedCount = processes.filter(p => p.status === 'completed').length

  useEffect(() => {
    if (isOpen) {
      // Reset processes when modal opens
      setProcesses(initialProcesses)
      setIsMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => setIsMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])
  
  // Reset processes when initialProcesses changes
  useEffect(() => {
    if (isOpen) {
      setProcesses(initialProcesses)
    }
  }, [initialProcesses, isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Auto-progress through processes for demo (4 seconds per process)
  useEffect(() => {
    if (!isOpen || !isAnimating || currentLoadingIndex < 0) {
      return
    }

    // Complete current loading process after 4 seconds and move to next
    const timer = setTimeout(() => {
      setProcesses(prevProcesses => {
        const updated = [...prevProcesses]
        const loadingIdx = updated.findIndex(p => p.status === 'loading')
        
        // Mark current loading process as completed
        if (loadingIdx >= 0 && updated[loadingIdx].status === 'loading') {
          updated[loadingIdx] = {
            ...updated[loadingIdx],
            status: 'completed'
          }
          
          // Start next process if available
          if (loadingIdx + 1 < updated.length) {
            updated[loadingIdx + 1] = {
              ...updated[loadingIdx + 1],
              status: 'loading'
            }
          }
        }
        
        return updated
      })
    }, 4000)

    return () => clearTimeout(timer)
  }, [isOpen, isAnimating, currentLoadingIndex])

  // Check if all processes are completed and trigger onComplete
  useEffect(() => {
    if (isOpen && processes.length > 0) {
      const allCompleted = processes.every(p => p.status === 'completed')
      if (allCompleted && onComplete) {
        // Wait a moment for the final animation, then navigate
        const timer = setTimeout(() => {
          onComplete()
        }, 1000) // 1 second delay to show completion
        return () => clearTimeout(timer)
      }
    }
  }, [processes, isOpen, onComplete])

  // All hooks must be called before any conditional returns
  const overlayStyle = useMemo<React.CSSProperties>(() => ({
    backgroundColor: colorValues.overlay,
    opacity: isAnimating ? 1 : 0,
    transition: isMounted ? createTransition(['opacity']) : 'none',
    pointerEvents: (isAnimating ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isMounted ? 'visible' : 'hidden') as React.CSSProperties['visibility'],
    zIndex: 9999 // Ensure overlay stays on top during navigation
  }), [isAnimating, isMounted])

  const modalRightStyle = useMemo<React.CSSProperties>(() => ({
    left: `calc(100vw - ${sizes.width.modal} - ${spacing['3xl']})`,
    transition: isMounted ? createTransition(['opacity', 'transform'], 'default', 'decelerate') : 'none',
    opacity: isAnimating ? 1 : 0,
    transform: isAnimating ? 'translateY(0)' : 'translateY(-8px)',
    pointerEvents: (isAnimating ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isMounted ? 'visible' : 'hidden') as React.CSSProperties['visibility']
  }), [isAnimating, isMounted])

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose()
    }
  }, [onClose])

  if (!isMounted) {
    return null
  }

  return (
    <>
      {showOverlay && (
        <div
          className="fixed inset-0"
          style={overlayStyle}
          onClick={handleOverlayClick}
        />
      )}
      <div
        className="fixed bg-v2-background-primary border border-v2-border border-solid box-border content-stretch flex flex-col gap-[40px] items-end p-[16px] right-0 top-[24px] bottom-[24px] rounded-[12px] w-[480px]"
        style={{ ...modalRightStyle, zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-center min-h-px min-w-px relative shrink-0 w-full">
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
            <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px not-italic opacity-0 relative shrink-0">
              <p className="leading-[28px] relative shrink-0 text-[18px] text-v2-text-primary w-full" style={fontSemibold}>
                Apply for a job
              </p>
              <p className="leading-[20px] relative shrink-0 text-[14px] text-v2-text-body-primary w-full" style={fontMedium}>
                Paste the job description and your resume to optimize and generate assets.
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="overflow-clip relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
                aria-label="Close modal"
              >
                <img alt="" className="block max-w-none size-full" src={imgCloseIcon} />
              </button>
            )}
          </div>
          <div className="basis-0 box-border content-stretch flex flex-col gap-[120px] grow items-center min-h-px min-w-px pb-0 pt-[120px] px-[40px] relative shrink-0 w-full">
            {/* Title and Description - positioned above gradients with z-index */}
            <div className="content-stretch flex flex-col items-start not-italic relative shrink-0 w-full z-30">
              <p className="leading-[28px] relative shrink-0 text-[18px] text-v2-text-primary w-full" style={fontSemibold}>
                {title}
              </p>
              <p className="leading-[20px] relative shrink-0 text-[14px] text-v2-text-secondary w-full" style={fontMedium}>
                {description || 'Every setback is a setup for a comeback. Keep pushing forward!'}
              </p>
            </div>
            {/* Process List Container - moves up as processes complete */}
            {(() => {
              // Process list positioning ensures the loading process is always in a clear visible area
              // Top gradient: 155px to 255px (100px height) - masks completed processes
              // Clear visible area: 255px to ~303px - where loading process should be
              // Bottom gradient: starts at 303px to mask pending processes
              const completedCount = processes.filter(p => p.status === 'completed').length
              const loadingIndex = processes.findIndex(p => p.status === 'loading')
              const itemHeight = 48 // gap-[24px] + item height [24px]
              const clearVisibleAreaTop = 255 // End of top gradient
              const clearVisibleAreaBottom = 303 // Start of bottom gradient
              
              // Position the list so the loading process is at clearVisibleAreaTop (255px)
              // When loadingIndex = 0: listTopOffset = 255
              // When loadingIndex = 1: listTopOffset = 255 - 48 = 207
              // When loadingIndex = 2: listTopOffset = 255 - 96 = 159
              const listTopOffset = loadingIndex >= 0 ? clearVisibleAreaTop - (loadingIndex * itemHeight) : 255
              
              // Stop moving when all processes are completed
              const totalProcesses = processes.length
              const allCompleted = completedCount >= totalProcesses
              const effectiveOffset = allCompleted ? clearVisibleAreaTop - ((totalProcesses - 1) * itemHeight) : listTopOffset
              
              return (
                <div 
                  className="absolute content-stretch flex flex-col gap-[24px] items-start w-[368px]"
                  style={{
                    left: '40px',
                    top: `${effectiveOffset}px`,
                    transition: 'top 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'top'
                  }}
                >
                  {processes.map((process, index) => {
                    const isCompleted = process.status === 'completed'
                    const isLoading = process.status === 'loading'
                    const isPending = process.status === 'pending'
                    
                    return (
                      <div
                        key={`${process.id}-${process.status}`}
                        className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full"
                        style={{
                          opacity: isAnimating ? 1 : 0,
                          transform: isAnimating ? 'translateY(0)' : 'translateY(10px)',
                          transition: `opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) ${isAnimating ? index * 100 : 0}ms, transform 300ms cubic-bezier(0.4, 0, 0.2, 1) ${isAnimating ? index * 100 : 0}ms`
                        }}
                      >
                        <div className="overflow-clip relative shrink-0 size-[16px]">
                          {isCompleted ? (
                            // Completed: Show check icon (16px, green #008000)
                            <img 
                              alt="" 
                              className="block max-w-none size-full" 
                              src={imgCheckIcon}
                              style={{
                                transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                              }}
                            />
                          ) : (
                            // Loading or Pending: Show loading icon (16px, yellow #ddd2a3)
                            <img
                              alt=""
                              className="block max-w-none size-full"
                              src={imgLoadingIcon}
                              style={{
                                animation: isLoading ? 'spin 1s linear infinite' : 'none',
                                transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                              }}
                            />
                          )}
                        </div>
                        <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
                          {process.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
            {/* Top gradient - masks completed processes above (fixed position per Figma: x=40, y=155, height: 100px, width: 368px) */}
            <div
              className="absolute pointer-events-none z-20"
              style={{
                left: '40px',
                top: '155px',
                width: '368px',
                height: '100px',
                background: 'linear-gradient(to bottom, rgba(21, 22, 25, 1) 7%, rgba(21, 22, 25, 0.8) 59.76%, rgba(21, 22, 25, 0) 100%)'
              }}
            />
            {/* Bottom gradient - masks upcoming/pending processes below */}
            {/* Positioned to start at clearVisibleAreaBottom (303px) to mask processes below the loading process */}
            <div
              className="absolute pointer-events-none z-20"
              style={{
                left: '40px',
                top: '303px', // Starts right after the clear visible area (255px + 48px for one item)
                width: '368px',
                height: '200px', // Extended height to ensure it covers pending processes
                background: 'linear-gradient(to bottom, rgba(21, 22, 25, 0) 0%, rgba(21, 22, 25, 0.4) 30%, rgba(21, 22, 25, 0.8) 60%, rgba(21, 22, 25, 1) 100%)'
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

