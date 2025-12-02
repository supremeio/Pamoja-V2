'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { typography } from '@/lib/typography/v2'
import { colors } from '@/lib/colors/v2'
import { spacing } from '@/lib/spacing/v2'
import { sizes } from '@/lib/sizing/v2'
import { createTransition } from '@/lib/transitions/v2'

const fontMedium = typography.medium

// Icon assets from local icon library
const img7 = "/icons/v2/delete-icon.svg" // Delete icon
const img8 = "/icons/v2/edit-icon.svg" // Edit icon
const img9 = "/icons/v2/minus-icon.svg" // Minus icon
const img10 = "/icons/v2/copy-icon.svg" // Copy icon
const imgCheckIcon = "/icons/v2/check-icon.svg" // Check icon

interface QuestionRowProps {
  id: string
  question: string
  answer?: string
  hasAnswer: boolean
  isExpanded: boolean
  isEditing?: boolean
  onToggleExpand: (id: string) => void
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  onSave?: (id: string, newAnswer: string) => void
  onCopy?: (id: string) => void
  showDivider?: boolean
}

type QuestionRowState = 'collapsed' | 'hover' | 'expanded'

export const QuestionRow = React.memo(function QuestionRow({
  id,
  question,
  answer = '',
  hasAnswer,
  isExpanded,
  isEditing = false,
  onToggleExpand,
  onDelete,
  onEdit,
  onSave,
  onCopy,
  showDivider = false
}: QuestionRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [editValue, setEditValue] = useState(answer)
  const [isTextareaFocused, setIsTextareaFocused] = useState(false)
  const [isTextareaTyping, setIsTextareaTyping] = useState(false)
  const [isTextareaHovered, setIsTextareaHovered] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const copyTimeoutRef = useRef<NodeJS.Timeout>()

  const state: QuestionRowState = useMemo(() => 
    isExpanded ? 'expanded' : isHovered ? 'hover' : 'collapsed',
    [isExpanded, isHovered]
  )

  const handleMouseEnter = useCallback(() => {
    if (!isExpanded) {
      setIsHovered(true)
    }
  }, [isExpanded])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleExpand(id)
    setIsHovered(false)
  }, [id, onToggleExpand])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(id)
  }, [id, onDelete])

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setEditValue(answer)
    onEdit?.(id)
  }, [id, answer, onEdit])

  const handleSave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onSave?.(id, editValue)
  }, [id, editValue, onSave])

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onCopy?.(id)
    setIsCopied(true)
    // Clear any existing timeout
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current)
    }
    // Reset to copy icon after 2 seconds
    copyTimeoutRef.current = setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }, [id, onCopy])

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setEditValue(newValue)
    setIsTextareaTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTextareaTyping(false)
    }, 500)
  }, [])

  const handleTextareaFocus = useCallback(() => {
    setIsTextareaFocused(true)
  }, [])

  const handleTextareaBlur = useCallback(() => {
    setTimeout(() => {
      const activeElement = document.activeElement
      const container = containerRef.current
      const isFocusWithin = container?.contains(activeElement)

      if (!isFocusWithin && editValue.length === 0) {
        setIsTextareaFocused(false)
        setIsTextareaTyping(false)
      }
    }, 0)
  }, [editValue.length])

  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isTextareaClick = target.tagName === 'TEXTAREA'
    const isButtonClick = target.closest('button') || target.closest('[data-icon]')
    
    if (!isTextareaClick && !isButtonClick && textareaRef.current) {
      e.preventDefault()
      e.stopPropagation()
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 0)
    }
  }, [])

  const handleContainerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isTextareaClick = target.tagName === 'TEXTAREA'
    const isButtonClick = target.closest('button') || target.closest('[data-icon]')
    
    if (!isTextareaClick && !isButtonClick && textareaRef.current) {
      e.preventDefault()
      textareaRef.current.focus()
    }
  }, [])

  const handleTextareaMouseEnter = useCallback(() => {
    setIsTextareaHovered(true)
  }, [])

  const handleTextareaMouseLeave = useCallback(() => {
    setIsTextareaHovered(false)
  }, [])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length)
    }
  }, [isEditing])

  useEffect(() => {
    if (!isEditing) {
      setEditValue(answer)
      setIsTextareaFocused(false)
      setIsTextareaTyping(false)
    }
  }, [isEditing, answer])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const rowStyle = useMemo(() => ({
    cursor: 'default' as const,
    position: 'relative' as const,
    zIndex: 1,
    gap: state === 'expanded' || isEditing ? spacing.md : spacing.sm
  }), [state, isEditing])

  const hasEditText = editValue.length > 0
  const textareaContainerStyle = useMemo(() => ({
    backgroundColor: colors.background.primary,
    borderColor: isTextareaFocused || (isTextareaTyping && hasEditText) ? colors.border.active : colors.border.default,
    borderWidth: sizes.height.border,
    borderStyle: 'solid',
    transition: createTransition(['border-color', 'background-color'])
  }), [isTextareaFocused, isTextareaTyping, hasEditText])

  const textareaStyle = useMemo(() => {
    let textColor: string = colors.text.secondary
    let textOpacity = 1
    
    if (!hasEditText) {
      if (isTextareaFocused) {
        textColor = colors.text.muted
        textOpacity = 0.3
      } else if (isTextareaHovered) {
        textColor = colors.text.primary
        textOpacity = 0.5
      } else {
        textColor = colors.text.muted
        textOpacity = 0.3
      }
    }
    
    return {
      ...fontMedium,
      color: textColor,
      opacity: textOpacity,
      caretColor: isTextareaTyping && hasEditText ? colors.text.caret : colors.text.primary,
      transition: createTransition(['color', 'opacity'])
    }
  }, [hasEditText, isTextareaFocused, isTextareaHovered, isTextareaTyping])

  return (
    <>
      <div
        className="box-border content-stretch flex flex-col items-start justify-center relative shrink-0 w-full group"
        style={{
          backgroundColor: colors.background.card,
          padding: spacing.lg,
          borderRadius: sizes.borderRadius.md,
          ...rowStyle,
          transition: createTransition(['all'], 'slow')
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
          <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap tracking-[-0.14px] whitespace-pre" style={fontMedium}>
            {question}
          </p>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
            {isEditing ? (
              <div
                className="relative shrink-0 size-[16px] cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
                onClick={handleSave}
                data-icon="check"
              >
                <div className="absolute contents inset-0">
                  <img 
                    alt="" 
                    className="block max-w-none size-full" 
                    src={imgCheckIcon}
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(100%)',
                      transition: 'filter 200ms ease-in-out',
                      width: '16px',
                      height: '16px'
                    }}
                  />
                </div>
              </div>
            ) : (
              (isExpanded || isHovered) && (
                <div
                  className="content-stretch flex gap-[8px] items-center relative shrink-0 transition-all duration-300 ease-in-out"
                >
                  <div
                    className="relative shrink-0 size-[16px] cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
                    onClick={handleDelete}
                  >
                    <div className="absolute contents inset-0">
                      <img alt="" className="block max-w-none size-full" src={img7} />
                    </div>
                  </div>
                  <div
                    className="relative shrink-0 size-[16px] cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
                    onClick={handleEdit}
                  >
                    <div className="absolute contents inset-0">
                      <img alt="" className="block max-w-none size-full" src={img8} />
                    </div>
                  </div>
                </div>
              )
            )}
            {!isEditing && (
              <div
                className="overflow-clip relative shrink-0 size-[16px] cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out"
                onClick={handleToggle}
              >
                {isExpanded ? (
                  <img alt="" className="block max-w-none size-full" src={img9} />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="block max-w-none size-full">
                    <path d="M5 10H15" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 15V5" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>
        {(state === 'expanded' || isEditing) && (
          <div className="content-stretch flex flex-col gap-[4px] items-end justify-center relative shrink-0 w-full transition-all duration-300 ease-in-out" style={{ animation: isEditing ? 'none' : 'fadeInUp 0.3s ease-in-out' }}>
            {isEditing ? (
              <div
                ref={containerRef}
                className="bg-v2-background-primary border border-solid box-border content-stretch flex gap-[12px] items-center p-[16px] relative rounded-[6px] shrink-0 w-full transition-all duration-200 ease-in-out"
                style={textareaContainerStyle}
                onClick={handleContainerClick}
                onMouseDown={handleContainerMouseDown}
                onMouseEnter={handleTextareaMouseEnter}
                onMouseLeave={handleTextareaMouseLeave}
              >
                <textarea
                  ref={textareaRef}
                  value={editValue}
                  onChange={handleTextareaChange}
                  onFocus={handleTextareaFocus}
                  onBlur={handleTextareaBlur}
                  placeholder=""
                  className="v2-scrollbar bg-transparent border-none outline-none w-full resize-none text-[14px] leading-[20px] min-h-[20px] max-h-[100px] focus:ring-0 focus:ring-transparent focus:border-none focus:outline-none !shadow-none cursor-text overflow-y-auto"
                  style={{
                    ...textareaStyle,
                    height: 'auto',
                    maxHeight: '100px',
                    lineHeight: '20px'
                  }}
                  rows={5}
                  autoComplete="off"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                  }}
                />
              </div>
            ) : hasAnswer && answer ? (
              <>
                <p className="leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-v2-text-secondary w-[min-content] whitespace-pre-wrap" style={fontMedium}>
                  {answer}
                </p>
                <div
                  className="relative shrink-0 size-[16px] cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
                  onClick={handleCopy}
                >
                  <div className="absolute contents inset-0">
                    {isCopied ? (
                      <div className="relative shrink-0 size-[16px]">
                        <div className="absolute contents inset-0">
                          <img alt="" className="block max-w-none size-full" src={imgCheckIcon} style={{ filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)', width: '16px', height: '16px' }} />
                        </div>
                      </div>
                    ) : (
                      <img alt="" className="block max-w-none size-full" src={img10} />
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
      {showDivider && (
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
            <div className="h-[1px] w-full bg-v2-border" />
          </div>
        </div>
      )}
    </>
  )
})

