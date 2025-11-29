'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { typography } from '@/lib/typography/v2'
import { colorValues } from '@/lib/colors/v2'
import { createTransition } from '@/lib/transitions/v2'

const fontMedium = typography.medium
const fontSemibold = typography.semibold

interface DeleteApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteApplicationModal({
  isOpen,
  onClose,
  onConfirm
}: DeleteApplicationModalProps) {
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

  const overlayStyle = useMemo<React.CSSProperties>(() => ({
    backgroundColor: colorValues.overlay,
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
            Delete application?
          </p>
          <p className="leading-[1.7] relative shrink-0 text-[14px] text-v2-text-secondary w-full" style={fontMedium}>
            Deleting this application will remove it from your list and cannot be undone.
          </p>
        </div>
        <div className="content-stretch flex gap-[16px] items-start justify-end relative shrink-0 w-full">
          <button
            onClick={onClose}
            className="basis-0 bg-v2-background-primary border border-v2-border border-solid box-border content-stretch flex gap-[4px] grow items-center justify-center min-h-px min-w-px px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              Cancel
            </p>
          </button>
          <button
            onClick={handleConfirm}
            className="basis-0 box-border content-stretch flex gap-[4px] grow items-center justify-center min-h-px min-w-px px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: colorValues.destructive.primary }}
          >
            <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              Delete application
            </p>
          </button>
        </div>
      </div>
    </>
  )
}

