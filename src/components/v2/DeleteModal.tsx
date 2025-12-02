'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { typography } from '@/lib/typography/v2'
import { colors } from '@/lib/colors/v2'
import { createTransition } from '@/lib/transitions/v2'

const fontMedium = typography.medium
const fontSemibold = typography.semibold

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmButtonText?: string
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete item?',
  description = 'Deleting this item will remove it and cannot be undone.',
  confirmButtonText = 'Delete'
}: DeleteModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
    } else {
      const timer = setTimeout(() => setIsMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

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

  // All hooks must be called before any early returns
  const overlayStyle = useMemo<React.CSSProperties>(() => ({
    backgroundColor: colors.overlay,
    opacity: isOpen ? 1 : 0,
    transition: createTransition(['opacity'], 'slow'),
    pointerEvents: (isOpen ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isOpen ? 'visible' : 'hidden') as React.CSSProperties['visibility']
  }), [isOpen])

  const modalStyle = useMemo<React.CSSProperties>(() => ({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translate(-50%, 0)' : 'translate(-50%, -10px)',
    transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: (isOpen ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isOpen ? 'visible' : 'hidden') as React.CSSProperties['visibility']
  }), [isOpen])

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  const handleConfirm = useCallback(() => {
    onConfirm()
    onClose()
  }, [onConfirm, onClose])

  // Early return after all hooks
  if (!isMounted) {
    return null
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={overlayStyle}
        onClick={handleOverlayClick}
      />
      <div
        className="fixed bg-v2-background-primary border border-v2-border border-solid box-border content-stretch flex flex-col gap-[20px] items-start left-1/2 p-[24px] rounded-[12px] top-[160px] w-[420px] z-50"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
          <p className="leading-[28px] relative shrink-0 text-[18px] text-v2-text-primary w-full" style={fontSemibold}>
            {title}
          </p>
          <p className="leading-[1.7] relative shrink-0 text-[14px] text-v2-text-secondary w-full" style={fontMedium}>
            {description}
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-start justify-end relative shrink-0 w-full">
          <button
            onClick={onClose}
            className="basis-0 bg-v2-background-primary border border-v2-border border-solid box-border content-stretch flex gap-[4px] grow items-center justify-center min-h-px min-w-px px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              Cancel
            </p>
          </button>
          <button
            onClick={handleConfirm}
            className="basis-0 box-border content-stretch flex gap-[4px] grow items-center justify-center min-h-px min-w-px px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: colors.destructive.primary }}
          >
            <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              {confirmButtonText}
            </p>
          </button>
        </div>
      </div>
    </>
  )
}

