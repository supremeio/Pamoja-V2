'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { TextField } from './TextField'
import { FileUploadState } from './FileUpload'
import { ResumeUploadSection } from './ResumeUploadSection'
import { typography } from '@/lib/typography/v2'
import { colorValues } from '@/lib/colors/v2'
import { createTransition } from '@/lib/transitions/v2'

const fontMedium = typography.medium
const fontSemibold = typography.semibold

// Icon assets from local icon library
const imgCloseIcon = "/icons/v2/close-icon.svg"
const imgOptimizeIcon = "/icons/v2/optimize-icon.svg"

interface OptimizeResumeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: {
    role: string
    resumeText: string
  }) => void
}

export function OptimizeResumeModal({ isOpen, onClose, onSubmit }: OptimizeResumeModalProps) {
  const [formData, setFormData] = useState({
    role: '',
    resumeText: ''
  })

  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // File upload states
  const [uploadState, setUploadState] = useState<FileUploadState>('default')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const uploadProgressIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      setIsClosing(false)
      setIsSubmitting(false)
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

  // Cleanup upload progress interval
  useEffect(() => {
    return () => {
      if (uploadProgressIntervalRef.current) {
        clearInterval(uploadProgressIntervalRef.current)
      }
    }
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    onSubmit?.(formData)
    // TODO: Call API and handle loading states
  }, [formData, onSubmit])

  const handleChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const validExtensions = ['.pdf', '.doc', '.docx']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validExtensions.includes(fileExtension)) {
      setUploadError('Please upload a PDF or DOC file')
      setUploadState('error')
      return
    }

    setUploadError(null)
    setUploadedFileName(file.name)
    setUploadState('uploading')
    setUploadProgress(0)

    // Simulate upload progress
    uploadProgressIntervalRef.current = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          if (uploadProgressIntervalRef.current) {
            clearInterval(uploadProgressIntervalRef.current)
          }
          setUploadState('uploaded')
          // TODO: Read file content and set to resumeText
          return 100
        }
        return prev + 10
      })
    }, 200)
  }, [])


  const overlayStyle: React.CSSProperties = { 
    backgroundColor: colorValues.overlay,
    opacity: isAnimating ? 1 : 0,
    transition: isMounted ? createTransition(['opacity'], 'slow') : 'none',
    pointerEvents: (isAnimating ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isMounted ? 'visible' : 'hidden') as React.CSSProperties['visibility']
  }
  
  const modalLeftStyle: React.CSSProperties = { 
    left: 'calc(100vw - 480px - 24px)',
    transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
    transition: isMounted ? 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
    opacity: isAnimating ? 1 : 0,
    pointerEvents: (isAnimating ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isMounted ? 'visible' : 'hidden') as React.CSSProperties['visibility'],
    willChange: 'transform, opacity'
  }


  if (!isMounted) {
    return null
  }

  return (
    <>
      <div 
        className="fixed inset-0"
        style={{ ...overlayStyle, zIndex: 9999 }}
        onClick={onClose}
      />
      <div 
        className="fixed bg-v2-background-primary border border-v2-border border-solid box-border flex flex-col right-0 top-[24px] bottom-[24px] rounded-[12px] w-[480px]"
        style={{ ...modalLeftStyle, zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full p-[16px] pb-[16px]">
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
            <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px not-italic relative shrink-0">
              <p className="leading-[28px] relative shrink-0 text-[18px] text-v2-text-primary w-full" style={fontSemibold}>
                Optimize resume
              </p>
              <p className="leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-v2-text-secondary w-[min-content] whitespace-pre-wrap" style={fontMedium}>
                Optimize your resume for a better ATS score overall
              </p>
            </div>
            <button
              onClick={onClose}
              className="overflow-clip relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-out"
              style={{ willChange: 'transform, opacity' }}
              aria-label="Close modal"
            >
              <img alt="" className="block max-w-none size-full" src={imgCloseIcon} />
            </button>
          </div>
          </div>

        <div className="v2-scrollbar flex-1 overflow-y-auto px-[16px] min-h-0">
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full pt-[16px] pb-[16px]">
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="leading-[1.7] not-italic relative shrink-0 text-v2-text-accent text-[14px] text-nowrap uppercase whitespace-pre" style={fontMedium}>
                YOUR info
              </p>
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                <TextField
                  label="Job role"
                  placeholder="Select job role"
                  value={formData.role}
                  onChange={(value) => handleChange('role', value)}
                  variant="dropdown"
                  width="100%"
                  dropdownOptions={[
                    { label: 'Software Engineer', value: 'software-engineer' },
                    { label: 'Product Designer', value: 'product-designer' },
                    { label: 'Product Manager', value: 'product-manager' },
                    { label: 'Data Scientist', value: 'data-scientist' },
                    { label: 'UX Designer', value: 'ux-designer' },
                    { label: 'UI Designer', value: 'ui-designer' },
                    { label: 'Frontend Developer', value: 'frontend-developer' },
                    { label: 'Backend Developer', value: 'backend-developer' },
                    { label: 'Full Stack Developer', value: 'full-stack-developer' },
                    { label: 'DevOps Engineer', value: 'devops-engineer' },
                    { label: 'QA Engineer', value: 'qa-engineer' },
                    { label: 'Marketing Manager', value: 'marketing-manager' },
                    { label: 'Sales Manager', value: 'sales-manager' },
                    { label: 'Business Analyst', value: 'business-analyst' },
                    { label: 'Project Manager', value: 'project-manager' },
                    { label: 'HR Manager', value: 'hr-manager' },
                    { label: 'Operations Manager', value: 'operations-manager' },
                    { label: 'Other', value: 'other' }
                  ]}
                  onDropdownSelect={(value) => handleChange('role', value)}
                />
              </div>
            </div>

            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="leading-[1.7] not-italic relative shrink-0 text-v2-text-accent text-[14px] text-nowrap uppercase whitespace-pre" style={fontMedium}>
                Your resume
              </p>
              <ResumeUploadSection
                value={formData.resumeText}
                onChange={(value) => handleChange('resumeText', value)}
                onFileSelect={handleFileSelect}
                uploadState={uploadState}
                uploadProgress={uploadProgress}
                uploadError={uploadError}
                uploadedFileName={uploadedFileName}
                placeholder="Paste your resume text here..."
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>
        </div>

        <div className="content-stretch flex gap-[8px] items-start justify-end relative shrink-0 p-[16px] pt-[16px]">
          <button
            onClick={handleSubmit}
            disabled={!formData.role || !formData.resumeText}
            className="bg-v2-brand-primary box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] active:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ willChange: 'opacity, transform' }}
          >
            <div className="relative shrink-0 size-[20px]">
              <div className="absolute contents inset-0">
                <img 
                  alt="" 
                  className="block max-w-none size-full" 
                  src={imgOptimizeIcon}
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(1)',
                    width: '16px',
                    height: '16px'
                  }}
                />
              </div>
            </div>
            <p className="font-['Figtree:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              Optimize resume
            </p>
          </button>
        </div>
      </div>
    </>
  )
}

