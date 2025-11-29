'use client'

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { typography } from '@/lib/typography/v2'
import { colorValues } from '@/lib/colors/v2'
import { spacing } from '@/lib/spacing/v2'
import { sizes } from '@/lib/sizing/v2'
import { createTransition } from '@/lib/transitions/v2'

const fontMedium = typography.medium

// Icon assets from local icon library
const imgUploadIcon = "/icons/v2/upload-icon.svg"
const imgLoaderIcon = "/icons/v2/loader-icon.svg"
const imgCheckIcon = "/icons/v2/check-icon.svg"
const imgDeleteIcon = "/icons/v2/delete-icon.svg"
const imgRetryIcon = "/icons/v2/retry-icon.svg"
const imgWarningIcon = "/icons/v2/warning-icon.svg"

export type FileUploadState = 'default' | 'uploading' | 'uploaded' | 'error'

interface FileUploadProps {
  onFileSelect?: (file: File) => void
  onDelete?: () => void
  onRetry?: () => void
  fileName?: string
  uploadProgress?: number // 0-100
  errorMessage?: string
  state?: FileUploadState
  accept?: string
  className?: string
  fullWidth?: boolean // If true, component fills container width
}

export const FileUpload = React.memo(function FileUpload({
  onFileSelect,
  onDelete,
  onRetry,
  fileName,
  uploadProgress = 0,
  errorMessage,
  state: controlledState,
  accept = '.pdf,.doc,.docx',
  className = '',
  fullWidth = false
}: FileUploadProps) {
  const [internalState, setInternalState] = useState<FileUploadState>('default')
  const [isDragOver, setIsDragOver] = useState(false)
  const [internalProgress, setInternalProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout>()

  const state = controlledState ?? internalState

  // Auto-progress simulation for demo (only if state is uploading and no controlled progress)
  useEffect(() => {
    if (state === 'uploading' && uploadProgress === 0) {
      setInternalProgress(0)
      progressIntervalRef.current = setInterval(() => {
        setInternalProgress(prev => {
          if (prev >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current)
            }
            setInternalState('uploaded')
            return 100
          }
          return prev + 2
        })
      }, 50)
    } else if (state !== 'uploading') {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [state, uploadProgress])

  const currentProgress = uploadProgress > 0 ? uploadProgress : internalProgress

  const handleFileSelect = useCallback((file: File) => {
    onFileSelect?.(file)
    if (!controlledState) {
      setInternalState('uploading')
      setInternalProgress(0)
    }
  }, [onFileSelect, controlledState])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFileSelect])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (state === 'default') {
      fileInputRef.current?.click()
    }
  }, [state])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (state === 'default') {
      setIsDragOver(true)
    }
  }, [state])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (state !== 'default') return

    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase()
      return accept.split(',').some(ext => extension === ext.trim())
    })

    if (validFiles.length > 0) {
      handleFileSelect(validFiles[0])
    }
  }, [state, accept, handleFileSelect])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.()
    if (!controlledState) {
      setInternalState('default')
      setInternalProgress(0)
    }
  }, [onDelete, controlledState])

  const handleRetry = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onRetry?.()
    // Don't reset state - keep current file visible until new file is selected
    // Trigger file input to open file picker
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 0)
  }, [onRetry])

  const containerStyle = useMemo(() => {
    const baseStyle = {
      backgroundColor: colorValues.background.primary,
      borderWidth: sizes.height.border,
      borderStyle: 'solid',
      borderRadius: sizes.borderRadius.md,
      transition: createTransition(['all'])
    } as React.CSSProperties

    switch (state) {
      case 'error':
        return {
          ...baseStyle,
          borderColor: colorValues.border.error
        }
      case 'uploading':
      case 'uploaded':
      case 'default':
      default:
        return {
          ...baseStyle,
          borderColor: isDragOver ? colorValues.border.active : colorValues.border.light
        }
    }
  }, [state, isDragOver])

  const textColor = useMemo(() => {
    switch (state) {
      case 'error':
        return colorValues.text.error
      case 'uploading':
      case 'uploaded':
      case 'default':
      default:
        return colorValues.text.info
    }
  }, [state])

  const progressBarWidth = useMemo(() => {
    return `${Math.min(100, Math.max(0, currentProgress))}%`
  }, [currentProgress])

  return (
    <div className={`content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full ${className}`} data-file-upload>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />

      {state === 'default' && (
        <div
          className="bg-v2-background-primary border border-v2-border-light border-solid box-border content-stretch flex items-center justify-center relative shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:bg-v2-background-secondary hover:scale-[1.02] active:scale-[0.98] z-10"
          style={{ 
            gap: spacing.sm,
            paddingLeft: spacing.xl,
            paddingRight: spacing.xl,
            paddingTop: spacing.md,
            paddingBottom: spacing.md,
            borderRadius: sizes.borderRadius.md,
            width: '228px' // Specific design width - could be moved to sizes if reused
          }}
          onClick={handleClick}
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="relative shrink-0 size-[20px]">
            <div className="absolute contents inset-0">
              <img alt="" className="block max-w-none size-full" src={imgUploadIcon} style={{ width: '16px', height: '16px' }} />
            </div>
          </div>
          <p className="leading-[20px] not-italic relative shrink-0 text-v2-text-button text-[14px] text-nowrap whitespace-pre" style={fontMedium}>
            Upload resume (.pdf, docs)
          </p>
        </div>
      )}

      {state === 'uploading' && (
        <div
          className={`bg-v2-background-primary border border-solid box-border content-stretch flex items-center justify-between ${fullWidth ? 'p-[16px]' : 'pl-[16px] pr-[12px] py-[8px]'} relative rounded-[8px] shrink-0 transition-all duration-300 ease-in-out ${fullWidth ? 'w-full' : ''}`}
          style={{ ...containerStyle, ...(fullWidth ? {} : { width: '228px' }) }}
        >
          <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0 overflow-hidden">
            <div className="relative shrink-0 size-[20px] animate-spin">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={imgLoaderIcon} style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
            <p className="basis-0 grow leading-[20px] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-nowrap" style={{ ...fontMedium, color: textColor }}>
              {fileName || '[filename.pdf]'}
            </p>
          </div>
          <div className="box-border content-stretch flex flex-col gap-[10px] h-[20px] items-center justify-center px-0 py-[10px] relative shrink-0 w-[43px]">
            <div className="bg-v2-background-secondary box-border content-stretch flex flex-col gap-[10px] items-start p-px relative rounded-[40px] shrink-0 w-full">
              <div 
                className="shrink-0 transition-all duration-300 ease-out"
                style={{ 
                  backgroundColor: colorValues.success.primary,
                  height: sizes.height.progressBar,
                  borderRadius: sizes.borderRadius.pill,
                  width: progressBarWidth 
                }}
              />
            </div>
          </div>
        </div>
      )}

      {state === 'uploaded' && (
        <div
          className="bg-v2-background-primary border border-solid box-border content-stretch flex items-center justify-between pl-[16px] pr-[12px] py-[8px] relative rounded-[8px] shrink-0 transition-all duration-300 ease-in-out"
          style={{ ...containerStyle, width: '228px' }}
        >
          <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0 overflow-hidden">
            <div className="relative shrink-0 size-[20px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={imgCheckIcon} style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
            <p className="basis-0 grow leading-[20px] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-nowrap" style={{ ...fontMedium, color: textColor }}>
              {fileName || '[filename.pdf]'}
            </p>
          </div>
          <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 w-[63px]">
            <div
              className="relative shrink-0 size-[20px] cursor-pointer hover:opacity-80 transition-opacity duration-200 ease-in-out"
              onClick={handleDelete}
            >
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={imgDeleteIcon} style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
            <div
              className="relative shrink-0 size-[20px] cursor-pointer hover:opacity-80 transition-opacity duration-200 ease-in-out"
              onClick={handleRetry}
            >
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={imgRetryIcon} style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" style={{ width: '228px' }}>
          <div
            className="bg-v2-background-primary border border-solid box-border content-stretch flex items-center justify-between pl-[16px] pr-[12px] py-[8px] relative rounded-[8px] shrink-0 transition-all duration-300 ease-in-out"
            style={{ ...containerStyle, width: '228px' }}
          >
            <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0 overflow-hidden">
              <div className="relative shrink-0 size-[20px]">
                <div className="absolute contents inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgWarningIcon} style={{ width: '16px', height: '16px' }} />
                </div>
              </div>
              <p className="basis-0 grow leading-[20px] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-nowrap" style={{ ...fontMedium, color: textColor }}>
                {fileName || '[filename.pdf]'}
              </p>
            </div>
            <div
              className="relative shrink-0 size-[20px] cursor-pointer hover:opacity-80 transition-opacity duration-200 ease-in-out"
              onClick={handleRetry}
            >
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={imgRetryIcon} />
              </div>
            </div>
          </div>
          {errorMessage && (
            <p className="leading-[20px] not-italic relative shrink-0 text-[12px] w-full transition-all duration-300 ease-in-out" style={{ ...fontMedium, color: colorValues.text.error }}>
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

