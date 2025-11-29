'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { FileUpload, FileUploadState } from './FileUpload'
import { Separator } from './Separator'
import { typography } from '@/lib/typography/v2'
import { colorValues } from '@/lib/colors/v2'
import { createTransition } from '@/lib/transitions/v2'

const fontMedium = typography.medium

interface ResumeUploadSectionProps {
  value: string
  onChange: (value: string) => void
  onFileSelect?: (file: File) => void
  onFileDelete?: () => void
  onFileRetry?: () => void
  uploadState?: FileUploadState
  uploadProgress?: number
  uploadError?: string | null
  uploadedFileName?: string | null
  placeholder?: string
  accept?: string
}

export function ResumeUploadSection({
  value,
  onChange,
  onFileSelect,
  onFileDelete,
  onFileRetry,
  uploadState = 'default',
  uploadProgress = 0,
  uploadError = null,
  uploadedFileName = null,
  placeholder = 'Paste your resume text here...',
  accept = '.pdf,.doc,.docx'
}: ResumeUploadSectionProps) {
  // Resume textarea states (matching TextField behavior)
  const [isResumeFocused, setIsResumeFocused] = useState(false)
  const [isResumeHovered, setIsResumeHovered] = useState(false)
  const [isResumeTyping, setIsResumeTyping] = useState(false)
  const resumeTextareaRef = useRef<HTMLTextAreaElement>(null)
  const resumeContainerRef = useRef<HTMLDivElement>(null)
  const resumeTypingTimeoutRef = useRef<NodeJS.Timeout>()

  const handleResumeTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsResumeTyping(true)
    if (resumeTypingTimeoutRef.current) {
      clearTimeout(resumeTypingTimeoutRef.current)
    }
    resumeTypingTimeoutRef.current = setTimeout(() => {
      setIsResumeTyping(false)
    }, 500)
  }, [onChange])

  const handleResumeTextareaFocus = useCallback(() => {
    setIsResumeFocused(true)
  }, [])

  const handleResumeTextareaBlur = useCallback(() => {
    setTimeout(() => {
      const activeElement = document.activeElement
      const container = resumeContainerRef.current
      const isFocusWithin = container?.contains(activeElement)

      if (!isFocusWithin && value.length === 0) {
        setIsResumeFocused(false)
        setIsResumeTyping(false)
      }
    }, 0)
  }, [value.length])

  const handleResumeContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isTextareaClick = target.tagName === 'TEXTAREA'
    const isButtonClick = target.closest('button')
    const isFileUploadClick = target.closest('[data-file-upload]')
    
    if (!isTextareaClick && !isButtonClick && !isFileUploadClick && resumeTextareaRef.current) {
      e.preventDefault()
      e.stopPropagation()
      setTimeout(() => {
        resumeTextareaRef.current?.focus()
      }, 0)
    }
  }, [])

  const handleResumeContainerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isTextareaClick = target.tagName === 'TEXTAREA'
    const isButtonClick = target.closest('button')
    const isFileUploadClick = target.closest('[data-file-upload]')
    
    if (!isTextareaClick && !isButtonClick && !isFileUploadClick && resumeTextareaRef.current) {
      e.preventDefault()
      resumeTextareaRef.current.focus()
    }
  }, [])

  const handleResumeMouseEnter = useCallback(() => {
    setIsResumeHovered(true)
  }, [])

  const handleResumeMouseLeave = useCallback(() => {
    setIsResumeHovered(false)
  }, [])

  // Resume textarea computed styles (matching TextField)
  const hasResumeText = value.length > 0
  
  const resumeContainerStyle = useMemo(() => ({
    backgroundColor: colorValues.background.primary,
    borderColor: isResumeFocused || (isResumeTyping && hasResumeText) ? colorValues.border.active : colorValues.border.default,
    transition: createTransition(['border-color', 'background-color'])
  }), [isResumeFocused, isResumeTyping, hasResumeText])

  const resumeTextareaStyle = useMemo(() => {
    let textColor: string = colorValues.text.primary
    let textOpacity = 1
    
    if (!hasResumeText) {
      if (isResumeFocused) {
        textColor = colorValues.text.muted
        textOpacity = 0.3
      } else if (isResumeHovered) {
        textColor = colorValues.text.primary
        textOpacity = 0.5
      } else {
        textColor = colorValues.text.muted
        textOpacity = 0.3
      }
    }
    
    return {
      ...fontMedium,
      color: textColor,
      opacity: textOpacity,
      caretColor: isResumeTyping && hasResumeText ? colorValues.text.caret : colorValues.text.primary,
      transition: createTransition(['color', 'opacity'])
    }
  }, [hasResumeText, isResumeFocused, isResumeHovered, isResumeTyping])

  useEffect(() => {
    return () => {
      if (resumeTypingTimeoutRef.current) {
        clearTimeout(resumeTypingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={resumeContainerRef}
      className="bg-v2-background-primary border border-solid box-border content-stretch flex flex-col gap-[10px] items-start justify-center p-[12px] relative rounded-[8px] shrink-0 w-full transition-all duration-200 ease-in-out"
      style={resumeContainerStyle}
      onClick={handleResumeContainerClick}
      onMouseDown={handleResumeContainerMouseDown}
      onMouseEnter={handleResumeMouseEnter}
      onMouseLeave={handleResumeMouseLeave}
    >
      <div className="box-border content-stretch flex gap-[10px] items-start pb-[16px] pt-0 px-0 relative shrink-0 w-full">
        <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
          <textarea
            ref={resumeTextareaRef}
            value={value}
            onChange={handleResumeTextareaChange}
            onFocus={handleResumeTextareaFocus}
            onBlur={handleResumeTextareaBlur}
            placeholder={placeholder}
            className="v2-scrollbar bg-transparent border-none outline-none w-full resize-none text-[14px] leading-[20px] min-h-[20px] max-h-[100px] focus:ring-0 focus:ring-transparent focus:border-none focus:outline-none !shadow-none cursor-text overflow-y-auto"
            style={{
              ...resumeTextareaStyle,
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
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
        <Separator />
        <FileUpload
          onFileSelect={onFileSelect}
          onDelete={onFileDelete}
          onRetry={onFileRetry}
          fileName={uploadedFileName || undefined}
          uploadProgress={uploadProgress}
          errorMessage={uploadError || undefined}
          state={uploadState}
          accept={accept}
        />
      </div>
    </div>
  )
}

