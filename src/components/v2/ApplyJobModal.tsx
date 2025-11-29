'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { TextField } from './TextField'
import { LoadingModal } from './LoadingModal'
import { FileUploadState } from './FileUpload'
import { ResumeUploadSection } from './ResumeUploadSection'
import { typography } from '@/lib/typography/v2'

const fontMedium = typography.medium
const fontSemibold = typography.semibold

// Icon assets from local icon library
const imgCloseIcon = "/icons/v2/close-icon.svg" // Close icon
const img11 = "/icons/v2/cover-letter-icon.svg" // Generate cover letter icon
const img12 = "/icons/v2/optimize-icon.svg" // Optimize application icon

interface ApplyJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: {
    company: string
    role: string
    jobDescription: string
    resumeText: string
  }) => void
}

export function ApplyJobModal({ isOpen, onClose, onSubmit: _onSubmit }: ApplyJobModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jobDescription: '',
    resumeText: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  
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
      setIsNavigating(false)
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

  // Close modal when navigation to result page completes
  useEffect(() => {
    if (isNavigating && pathname === '/v2/result') {
      // Navigation completed, close modal smoothly
      setIsSubmitting(false)
      setIsNavigating(false)
      // Small delay to ensure result page is fully rendered
      const timer = setTimeout(() => {
        onClose()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [pathname, isNavigating, onClose])

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
    // TODO: Call API and handle loading states
  }, [])

  const handleChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const validExtensions = ['.pdf', '.doc', '.docx']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validExtensions.includes(fileExtension)) {
      setUploadError('Invalid file type. Please upload a .pdf, .doc, or .docx file.')
      setUploadState('error')
      return
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setUploadError('File too large.')
      setUploadState('error')
      return
    }

    // Start upload
    setUploadState('uploading')
    setUploadProgress(0)
    setUploadError(null)
    setUploadedFileName(file.name)

    // Simulate upload progress
    if (uploadProgressIntervalRef.current) {
      clearInterval(uploadProgressIntervalRef.current)
    }
    uploadProgressIntervalRef.current = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          if (uploadProgressIntervalRef.current) {
            clearInterval(uploadProgressIntervalRef.current)
          }
          uploadProgressIntervalRef.current = undefined
          setUploadState('uploaded')
          // TODO: Implement actual file upload API call
          return 100
        }
        return prev + 2
      })
    }, 50)
  }, [])

  const handleDeleteUpload = useCallback(() => {
    setUploadState('default')
    setUploadProgress(0)
    setUploadError(null)
    setUploadedFileName(null)
    // TODO: Implement delete uploaded file API call
  }, [])

  const handleRetryUpload = useCallback(() => {
    // Don't reset state - keep current file visible until new file is selected
    // The file picker will be opened by FileUpload component
    setUploadError(null)
  }, [])


  const overlayStyle: React.CSSProperties = { 
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    opacity: isAnimating ? 1 : 0,
    transition: isMounted ? 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
    pointerEvents: (isAnimating ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isMounted ? 'visible' : 'hidden') as React.CSSProperties['visibility']
  }
  
  const modalLeftStyle: React.CSSProperties = { 
    left: 'calc(100vw - 480px - 24px)',
    transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
    transition: isMounted ? 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
    opacity: isAnimating ? 1 : 0,
    pointerEvents: (isAnimating ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isMounted ? 'visible' : 'hidden') as React.CSSProperties['visibility']
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-50"
        style={overlayStyle}
        onClick={onClose}
      />
      {!isSubmitting && !isClosing ? (
        <>
      <div 
            className="fixed bg-v2-background-primary border border-v2-border border-solid box-border flex flex-col right-0 top-[24px] bottom-[24px] rounded-[12px] w-[480px] z-50"
        style={modalLeftStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full p-[16px] pb-[16px]">
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
            <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px not-italic relative shrink-0">
              <p className="leading-[28px] relative shrink-0 text-[18px] text-v2-text-primary w-full" style={fontSemibold}>
                Apply for a job
              </p>
              <p className="leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-v2-text-secondary w-[min-content] whitespace-pre-wrap" style={fontMedium}>
                Optimize for ATS / Paste the Job Description and your base resume. Pamoja will analyze keywords and adapt your story for maximum impact.
              </p>
            </div>
            <button
              onClick={onClose}
              className="overflow-clip relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
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
                Job info
              </p>
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                <TextField
                  label="Company's name"
                  placeholder="Employment Agency"
                  value={formData.company}
                  onChange={(value) => handleChange('company', value)}
                  width="100%"
                  showIcon={false}
                />

                <TextField
                  label="Job role"
                  placeholder="Select option"
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

                <TextField
                  label="Job description"
                  placeholder="Paste full job description here..."
                  value={formData.jobDescription}
                  onChange={(value) => handleChange('jobDescription', value)}
                  type="textarea"
                  width="100%"
                  showIcon={false}
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
                onFileDelete={handleDeleteUpload}
                onFileRetry={handleRetryUpload}
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
            type="button"
            onClick={onClose}
            className="bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:bg-v2-background-primary hover:border-v2-border-light hover:scale-[1.02] active:scale-[0.98] active:opacity-90"
          >
            <div className="relative shrink-0 size-[20px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img11} style={{ filter: 'brightness(0) invert(1)', width: '16px', height: '16px' }} />
              </div>
            </div>
            <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              Generate cover letter
            </p>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-v2-brand-primary box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] active:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="relative shrink-0 size-[20px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img12} style={{ filter: 'brightness(0) invert(1)', width: '16px', height: '16px' }} />
              </div>
            </div>
            <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              Optimize application
            </p>
          </button>
        </div>
      </div>
        </>
      ) : (
        <LoadingModal
          isOpen={isSubmitting}
          onClose={() => {
            setIsClosing(true)
            setIsSubmitting(false)
            setTimeout(() => {
              onClose()
            }, 300)
          }}
          onComplete={() => {
            // Start navigation while keeping loading modal visible
            // The modal will stay visible until navigation completes
            setIsNavigating(true)
            router.push('/v2/result')
            // Don't close modal here - let the pathname useEffect handle it
            // This ensures smooth transition without showing the form
          }}
          processes={[
            { id: '1', label: 'Process 1', status: 'loading' },
            { id: '2', label: 'Process 2', status: 'pending' },
            { id: '3', label: 'Process 3', status: 'pending' }
          ]}
          showOverlay={false}
        />
      )}
    </>
  )
}
