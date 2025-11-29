'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { SideNavigation } from '@/components/v2/SideNavigation'
import { TopNavigation } from '@/components/v2/TopNavigation'
import { OptimizeResumeModal } from '@/components/v2/OptimizeResumeModal'
import { useToast, toast } from '@/components/v2/Toast'
import { typography } from '@/lib/typography/v2'

const fontMedium = typography.medium
const fontSemibold = typography.semibold

// Icon assets from local icon library
const imgEditIcon = '/icons/v2/edit-icon.svg'
const imgDownloadIcon = '/icons/v2/download-icon.svg'
const imgCopyIcon = '/icons/v2/copy-icon.svg'
const imgCheckIcon = '/icons/v2/check-icon.svg'
const imgSaveIcon = '/icons/v2/save-icon.svg'
const imgDropdownIcon = '/icons/v2/dropdown-icon.svg'
const imgLoaderIcon = '/icons/v2/loader-icon.svg'
const imgMinusIcon = '/icons/v2/minus-icon.svg'

// Initial content
const initialResumeContent =
  'Oluwatosin Kazeem\nLagos, Nigeria | supremeux@gmail.com | LinkedIn URL | Portfolio\n\nWORK EXPERIENCE\n\nAutospend Lagos, Nigeria\nProduct Designer 2023 - Present\nOwned the design and development of a comprehensive design system, enhancing product release cycles by 25% and ensuring a consistent, visually polished user experience across the FinTech platform.\nRedesigned the funding management function, implementing AI-driven OCR automation to reduce manual data entry by 20% and improve user satisfaction.'
const initialCoverLetterContent =
  'Dear Hiring Manager,\n\nBased on the requirements for the Senior Product Designer at Google, My experience in designing... '

export default function ResultPage() {
  const { showToast } = useToast()
  const [isImprovementsExpanded, setIsImprovementsExpanded] = useState(false)
  const [isOriginalResumeExpanded, setIsOriginalResumeExpanded] = useState(false)
  const [saveJobState, setSaveJobState] = useState<'default' | 'saving' | 'saved'>('default')
  const [isHoveringUnsave, setIsHoveringUnsave] = useState(false)
  const [isOptimizeResumeModalOpen, setIsOptimizeResumeModalOpen] = useState(false)
  const [isResumeCopied, setIsResumeCopied] = useState(false)
  const [isCoverLetterCopied, setIsCoverLetterCopied] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const improvementsRef = useRef<HTMLDivElement>(null)
  const originalResumeRef = useRef<HTMLDivElement>(null)
  const resumeCopyTimeoutRef = useRef<NodeJS.Timeout>()
  const coverLetterCopyTimeoutRef = useRef<NodeJS.Timeout>()

  // Disable body and html scrolling to allow only the content area to scroll
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.height = '100vh'
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    return () => {
      document.documentElement.style.overflow = ''
      document.documentElement.style.height = ''
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.body.style.margin = ''
      document.body.style.padding = ''
    }
  }, [])

  // Edit state for resume
  const [isEditingResume, setIsEditingResume] = useState(false)
  const [resumeContent, setResumeContent] = useState(initialResumeContent)
  const [resumeEditValue, setResumeEditValue] = useState(initialResumeContent)
  const [isResumeTextareaFocused, setIsResumeTextareaFocused] = useState(false)
  const [isResumeTextareaTyping, setIsResumeTextareaTyping] = useState(false)
  const [isResumeTextareaHovered, setIsResumeTextareaHovered] = useState(false)
  const resumeTextareaRef = useRef<HTMLTextAreaElement>(null)
  const resumeContainerRef = useRef<HTMLDivElement>(null)
  const resumeTypingTimeoutRef = useRef<NodeJS.Timeout>()

  // Edit state for cover letter
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false)
  const [coverLetterContent, setCoverLetterContent] = useState(initialCoverLetterContent)
  const [coverLetterEditValue, setCoverLetterEditValue] = useState(initialCoverLetterContent)
  const [isCoverLetterTextareaFocused, setIsCoverLetterTextareaFocused] = useState(false)
  const [isCoverLetterTextareaTyping, setIsCoverLetterTextareaTyping] = useState(false)
  const [isCoverLetterTextareaHovered, setIsCoverLetterTextareaHovered] = useState(false)
  const coverLetterTextareaRef = useRef<HTMLTextAreaElement>(null)
  const coverLetterContainerRef = useRef<HTMLDivElement>(null)
  const coverLetterTypingTimeoutRef = useRef<NodeJS.Timeout>()

  const handleEditResume = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setResumeEditValue(resumeContent)
      setIsEditingResume(true)
    },
    [resumeContent]
  )

  const handleSaveResume = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      const trimmedNew = resumeEditValue.trim()
      const trimmedOriginal = resumeContent.trim()

      const hasChanged = trimmedNew !== trimmedOriginal

      if (hasChanged) {
        setResumeContent(trimmedNew)
        showToast(toast.success('Resume updated successfully'))
      } else {
        showToast(toast.info('No changes were made'))
      }

      setIsEditingResume(false)
    },
    [resumeEditValue, resumeContent, showToast]
  )

  const handleDownloadResume = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement download resume functionality
  }, [])

  const handleCopyResume = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      // Copy resume content to clipboard
      if (isEditingResume) {
        navigator.clipboard.writeText(resumeEditValue)
      } else {
        navigator.clipboard.writeText(resumeContent)
      }
      setIsResumeCopied(true)
      // Clear any existing timeout
      if (resumeCopyTimeoutRef.current) {
        clearTimeout(resumeCopyTimeoutRef.current)
      }
      // Reset to copy icon after 2 seconds
      resumeCopyTimeoutRef.current = setTimeout(() => {
        setIsResumeCopied(false)
      }, 2000)
    },
    [isEditingResume, resumeEditValue, resumeContent]
  )

  const handleEditCoverLetter = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCoverLetterEditValue(coverLetterContent)
      setIsEditingCoverLetter(true)
    },
    [coverLetterContent]
  )

  const handleSaveCoverLetter = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      const trimmedNew = coverLetterEditValue.trim()
      const trimmedOriginal = coverLetterContent.trim()

      const hasChanged = trimmedNew !== trimmedOriginal

      if (hasChanged) {
        setCoverLetterContent(trimmedNew)
        showToast(toast.success('Cover letter updated successfully'))
      } else {
        showToast(toast.info('No changes were made'))
      }

      setIsEditingCoverLetter(false)
    },
    [coverLetterEditValue, coverLetterContent, showToast]
  )

  const handleDownloadCoverLetter = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement download cover letter functionality
  }, [])

  const handleCopyCoverLetter = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      // Copy cover letter content to clipboard
      if (isEditingCoverLetter) {
        navigator.clipboard.writeText(coverLetterEditValue)
      } else {
        navigator.clipboard.writeText(coverLetterContent)
      }
      setIsCoverLetterCopied(true)
      // Clear any existing timeout
      if (coverLetterCopyTimeoutRef.current) {
        clearTimeout(coverLetterCopyTimeoutRef.current)
      }
      // Reset to copy icon after 2 seconds
      coverLetterCopyTimeoutRef.current = setTimeout(() => {
        setIsCoverLetterCopied(false)
      }, 2000)
    },
    [isEditingCoverLetter, coverLetterEditValue, coverLetterContent]
  )

  const handleSaveJob = useCallback(async () => {
    if (saveJobState === 'saved') {
      // Unsave
      setSaveJobState('default')
      setIsHoveringUnsave(false)
    } else if (saveJobState === 'default') {
      // Save
      setSaveJobState('saving')

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSaveJobState('saved')
    }
  }, [saveJobState])

  const handleMenuItemClick = useCallback((action: string) => {
    if (action === 'optimize-resume') {
      // Use setTimeout to ensure menu closes first, then modal opens
      setTimeout(() => {
        setIsOptimizeResumeModalOpen(true)
      }, 100)
    }
    // Handle other actions as needed
  }, [])

  const handleOptimizeResumeSubmit = useCallback(
    async (_data: { role: string; resumeText: string }) => {
      // TODO: Implement optimize resume functionality and API integration
      showToast(toast.success('Resume optimization started'))
    },
    [showToast]
  )

  const handleToggleImprovements = useCallback(() => {
    const wasExpanded = isImprovementsExpanded
    setIsImprovementsExpanded((prev: boolean) => !prev)

    // Scroll to section when expanding
    if (!wasExpanded && improvementsRef.current && scrollContainerRef.current) {
      // Wait for animation to start, then scroll
      setTimeout(() => {
        const container = scrollContainerRef.current
        const element = improvementsRef.current
        if (container && element) {
          const containerRect = container.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()
          const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - 24 // 24px offset

          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          })
        }
      }, 100)
    }
  }, [isImprovementsExpanded])

  const handleToggleOriginalResume = useCallback(() => {
    const wasExpanded = isOriginalResumeExpanded
    setIsOriginalResumeExpanded((prev: boolean) => !prev)

    // Scroll to section when expanding
    if (!wasExpanded && originalResumeRef.current && scrollContainerRef.current) {
      // Wait for animation to start, then scroll
      setTimeout(() => {
        const container = scrollContainerRef.current
        const element = originalResumeRef.current
        if (container && element) {
          const containerRect = container.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()
          const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - 24 // 24px offset

          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          })
        }
      }, 100)
    }
  }, [isOriginalResumeExpanded])

  // Resume textarea handlers
  const handleResumeTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setResumeEditValue(newValue)
    setIsResumeTextareaTyping(true)
    if (resumeTypingTimeoutRef.current) {
      clearTimeout(resumeTypingTimeoutRef.current)
    }
    resumeTypingTimeoutRef.current = setTimeout(() => {
      setIsResumeTextareaTyping(false)
    }, 500)
  }, [])

  const handleResumeTextareaFocus = useCallback(() => {
    setIsResumeTextareaFocused(true)
  }, [])

  const handleResumeTextareaBlur = useCallback(() => {
    setTimeout(() => {
      const activeElement = document.activeElement
      const container = resumeContainerRef.current
      const isFocusWithin = container?.contains(activeElement)

      if (!isFocusWithin && resumeEditValue.length === 0) {
        setIsResumeTextareaFocused(false)
        setIsResumeTextareaTyping(false)
      }
    }, 0)
  }, [resumeEditValue.length])

  const handleResumeContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isTextareaClick = target.tagName === 'TEXTAREA'
    const isButtonClick = target.closest('button') || target.closest('[data-icon]')

    if (!isTextareaClick && !isButtonClick && resumeTextareaRef.current) {
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
    const isButtonClick = target.closest('button') || target.closest('[data-icon]')

    if (!isTextareaClick && !isButtonClick && resumeTextareaRef.current) {
      e.preventDefault()
      resumeTextareaRef.current.focus()
    }
  }, [])

  // Cover letter textarea handlers
  const handleCoverLetterTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setCoverLetterEditValue(newValue)
      setIsCoverLetterTextareaTyping(true)
      if (coverLetterTypingTimeoutRef.current) {
        clearTimeout(coverLetterTypingTimeoutRef.current)
      }
      coverLetterTypingTimeoutRef.current = setTimeout(() => {
        setIsCoverLetterTextareaTyping(false)
      }, 500)
    },
    []
  )

  const handleCoverLetterTextareaFocus = useCallback(() => {
    setIsCoverLetterTextareaFocused(true)
  }, [])

  const handleCoverLetterTextareaBlur = useCallback(() => {
    setTimeout(() => {
      const activeElement = document.activeElement
      const container = coverLetterContainerRef.current
      const isFocusWithin = container?.contains(activeElement)

      if (!isFocusWithin && coverLetterEditValue.length === 0) {
        setIsCoverLetterTextareaFocused(false)
        setIsCoverLetterTextareaTyping(false)
      }
    }, 0)
  }, [coverLetterEditValue.length])

  const handleCoverLetterContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isTextareaClick = target.tagName === 'TEXTAREA'
    const isButtonClick = target.closest('button') || target.closest('[data-icon]')

    if (!isTextareaClick && !isButtonClick && coverLetterTextareaRef.current) {
      e.preventDefault()
      e.stopPropagation()
      setTimeout(() => {
        coverLetterTextareaRef.current?.focus()
      }, 0)
    }
  }, [])

  const handleCoverLetterContainerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isTextareaClick = target.tagName === 'TEXTAREA'
    const isButtonClick = target.closest('button') || target.closest('[data-icon]')

    if (!isTextareaClick && !isButtonClick && coverLetterTextareaRef.current) {
      e.preventDefault()
      coverLetterTextareaRef.current.focus()
    }
  }, [])

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditingResume && resumeTextareaRef.current) {
      resumeTextareaRef.current.focus()
      resumeTextareaRef.current.setSelectionRange(
        resumeTextareaRef.current.value.length,
        resumeTextareaRef.current.value.length
      )
    }
  }, [isEditingResume])

  useEffect(() => {
    if (isEditingCoverLetter && coverLetterTextareaRef.current) {
      coverLetterTextareaRef.current.focus()
      coverLetterTextareaRef.current.setSelectionRange(
        coverLetterTextareaRef.current.value.length,
        coverLetterTextareaRef.current.value.length
      )
    }
  }, [isEditingCoverLetter])

  // Sync edit value when not editing
  useEffect(() => {
    if (!isEditingResume) {
      setResumeEditValue(resumeContent)
      setIsResumeTextareaFocused(false)
      setIsResumeTextareaTyping(false)
    }
  }, [isEditingResume, resumeContent])

  useEffect(() => {
    if (!isEditingCoverLetter) {
      setCoverLetterEditValue(coverLetterContent)
      setIsCoverLetterTextareaFocused(false)
      setIsCoverLetterTextareaTyping(false)
    }
  }, [isEditingCoverLetter, coverLetterContent])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (resumeTypingTimeoutRef.current) {
        clearTimeout(resumeTypingTimeoutRef.current)
      }
      if (coverLetterTypingTimeoutRef.current) {
        clearTimeout(coverLetterTypingTimeoutRef.current)
      }
    }
  }, [])

  // Resume textarea styles
  const hasResumeEditText = resumeEditValue.length > 0
  const resumeTextareaContainerStyle = useMemo(
    () => ({
      backgroundColor: '#151619',
      borderColor:
        isResumeTextareaFocused || (isResumeTextareaTyping && hasResumeEditText)
          ? '#ffffff'
          : '#252628',
      borderWidth: '1px',
      borderStyle: 'solid',
      transition:
        'border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    }),
    [isResumeTextareaFocused, isResumeTextareaTyping, hasResumeEditText]
  )

  const resumeTextareaStyle = useMemo(() => {
    let textColor = '#a1a2a3'
    let textOpacity = 1

    if (!hasResumeEditText) {
      if (isResumeTextareaFocused) {
        textColor = '#898989'
        textOpacity = 0.3
      } else if (isResumeTextareaHovered) {
        textColor = '#ffffff'
        textOpacity = 0.5
      } else {
        textColor = '#898989'
        textOpacity = 0.3
      }
    }

    return {
      ...fontMedium,
      color: textColor,
      opacity: textOpacity,
      caretColor: isResumeTextareaTyping && hasResumeEditText ? '#b6d8ff' : '#ffffff',
      transition:
        'color 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }, [hasResumeEditText, isResumeTextareaFocused, isResumeTextareaHovered, isResumeTextareaTyping])

  // Cover letter textarea styles
  const hasCoverLetterEditText = coverLetterEditValue.length > 0
  const coverLetterTextareaContainerStyle = useMemo(
    () => ({
      backgroundColor: '#151619',
      borderColor:
        isCoverLetterTextareaFocused || (isCoverLetterTextareaTyping && hasCoverLetterEditText)
          ? '#ffffff'
          : '#252628',
      borderWidth: '1px',
      borderStyle: 'solid',
      transition:
        'border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    }),
    [isCoverLetterTextareaFocused, isCoverLetterTextareaTyping, hasCoverLetterEditText]
  )

  const coverLetterTextareaStyle = useMemo(() => {
    let textColor = '#a1a2a3'
    let textOpacity = 1

    if (!hasCoverLetterEditText) {
      if (isCoverLetterTextareaFocused) {
        textColor = '#898989'
        textOpacity = 0.3
      } else if (isCoverLetterTextareaHovered) {
        textColor = '#ffffff'
        textOpacity = 0.5
      } else {
        textColor = '#898989'
        textOpacity = 0.3
      }
    }

    return {
      ...fontMedium,
      color: textColor,
      opacity: textOpacity,
      caretColor: isCoverLetterTextareaTyping && hasCoverLetterEditText ? '#b6d8ff' : '#ffffff',
      transition:
        'color 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }, [
    hasCoverLetterEditText,
    isCoverLetterTextareaFocused,
    isCoverLetterTextareaHovered,
    isCoverLetterTextareaTyping,
  ])

  return (
    <div className="bg-v2-background-primary flex flex-col h-screen w-full overflow-hidden">
      {/* Fixed Top Navigation */}
      <div className="flex-shrink-0">
        <TopNavigation onMenuItemClick={handleMenuItemClick} />
      </div>

      {/* Main Content Area - Fixed Height Container */}
      <div className="flex-1 flex gap-[40px] px-[80px] py-0 overflow-hidden min-h-0">
        {/* Fixed Side Navigation */}
        <div className="flex-shrink-0">
          <SideNavigation className="box-border content-stretch flex flex-col gap-[17px] items-start p-[24px] relative rounded-[16px] shrink-0 w-[280px]" />
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Fixed Breadcrumbs */}
          <div className="flex-shrink-0 px-[24px] pt-[24px] pb-[24px]">
            <div className="content-stretch flex font-['Figtree:Medium',sans-serif] gap-[4px] items-center leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap tracking-[-0.14px] w-full whitespace-pre">
              <Link
                href="/v2/dashboard"
                className="[text-underline-position:from-font] decoration-solid relative shrink-0 text-v2-text-primary underline"
              >
                Dashboard
              </Link>
              <p className="relative shrink-0 text-v2-text-primary">/</p>
              <p className="relative shrink-0 text-v2-text-muted">Optimized application</p>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden w-full px-[24px] pb-[24px] v2-scrollbar"
            style={{ minHeight: 0 }}
          >
            <div className="flex flex-col gap-[32px] items-start w-full">
              {/* Page Header */}
              <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                <div className="basis-0 content-stretch flex flex-col gap-[32px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
                  <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
                    <p
                      className="font-['Figtree:SemiBold',sans-serif] leading-[28px] relative shrink-0 text-[18px] text-v2-text-primary w-full"
                      style={fontSemibold}
                    >
                      Application analysis
                    </p>
                    <p
                      className="font-['Figtree:Medium',sans-serif] leading-[1.7] relative shrink-0 text-[14px] text-v2-text-secondary w-full"
                      style={fontMedium}
                    >
                      Here's what's happening with your job applications today.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSaveJob}
                  onMouseEnter={() => {
                    if (saveJobState === 'saved') {
                      setIsHoveringUnsave(true)
                    }
                  }}
                  onMouseLeave={() => {
                    if (saveJobState === 'saved') {
                      setIsHoveringUnsave(false)
                    }
                  }}
                  disabled={saveJobState === 'saving'}
                  className="box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 w-[112px] cursor-pointer transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: saveJobState === 'default' ? '#145075' : '#1d1f22',
                    transition:
                      'background-color 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'background-color, transform',
                  }}
                >
                  {/* Icon Container */}
                  <div className="overflow-clip relative shrink-0 size-[20px]">
                    {saveJobState === 'default' && (
                      <div className="absolute contents inset-0">
                        <img
                          alt=""
                          className="block max-w-none size-full"
                          src={imgSaveIcon}
                          style={{ width: '16px', height: '16px' }}
                        />
                      </div>
                    )}
                    {saveJobState === 'saving' && (
                      <div className="absolute contents inset-0">
                        <img
                          alt=""
                          className="block max-w-none size-full"
                          src={imgLoaderIcon}
                          style={{
                            filter: 'brightness(0) saturate(100%) invert(1)',
                            animation: 'spin 1s linear infinite',
                            width: '16px',
                            height: '16px',
                          }}
                        />
                      </div>
                    )}
                    {saveJobState === 'saved' && !isHoveringUnsave && (
                      <div className="absolute contents inset-0">
                        <img
                          alt=""
                          className="block max-w-none size-full"
                          src={imgCheckIcon}
                          style={{
                            filter:
                              'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)',
                            transition: 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                            width: '16px',
                            height: '16px',
                          }}
                        />
                      </div>
                    )}
                    {saveJobState === 'saved' && isHoveringUnsave && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative shrink-0 size-[20px]">
                          <img
                            alt=""
                            className="block max-w-none size-full"
                            src={imgMinusIcon}
                            style={{
                              filter: 'brightness(0) saturate(100%) invert(1)',
                              transition: 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <p
                    className="font-['Figtree:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre transition-colors duration-300 ease-out"
                    style={{
                      ...fontMedium,
                      color: saveJobState === 'saved' && !isHoveringUnsave ? '#898989' : '#ffffff',
                      transition: 'color 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {saveJobState === 'default' && 'Save job'}
                    {saveJobState === 'saving' && 'Saving...'}
                    {saveJobState === 'saved' && !isHoveringUnsave && 'Saved'}
                    {saveJobState === 'saved' && isHoveringUnsave && 'Unsave'}
                  </p>
                </button>
              </div>

              {/* Content Area */}
              <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
                {/* Left Column - Optimized Resume and Cover Letter */}
                <div className="basis-0 content-stretch flex flex-col gap-[24px] grow items-start min-h-px min-w-px relative shrink-0">
                  {/* Job Summary */}
                  <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
                    <div className="content-stretch flex font-['Figtree:SemiBold',sans-serif] gap-[4px] items-center leading-[28px] relative shrink-0 text-[18px] text-nowrap whitespace-pre">
                      <p className="relative shrink-0 text-v2-text-primary" style={fontSemibold}>
                        Senior product designer
                      </p>
                      <p className="relative shrink-0 text-v2-text-secondary" style={fontSemibold}>
                        {' at '}
                      </p>
                      <p className="relative shrink-0 text-v2-text-primary" style={fontSemibold}>
                        Google, San Francisco
                      </p>
                    </div>
                    <p
                      className="font-['Figtree:Medium',sans-serif] leading-[24px] min-w-full relative shrink-0 text-[15px] text-v2-text-secondary tracking-[-0.15px] w-[min-content]"
                      style={fontMedium}
                    >
                      Your resume is optimized significantly to improve your match score.
                    </p>
                  </div>

                  {/* FAQ Section - Optimized Resume and Cover Letter */}
                  <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
                      {/* Optimized Resume Card */}
                      <div
                        className="basis-0 bg-[#1a1b1e] box-border content-stretch flex flex-col gap-[8px] grow h-[400px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shrink-0"
                        style={{ isolation: 'isolate' }}
                      >
                        <div
                          className="content-stretch flex items-center justify-between relative shrink-0 w-full"
                          style={{ cursor: 'default', isolation: 'isolate', zIndex: 1 }}
                        >
                          <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
                            <p
                              className="font-['Figtree:SemiBold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[18px] text-v2-text-primary text-nowrap whitespace-pre"
                              style={fontSemibold}
                            >
                              Optimized resume
                            </p>
                            <div className="bg-[#123520] border border-[#386f4e] border-solid box-border content-stretch flex items-center justify-center px-[12px] py-[2px] relative rounded-[40px] shrink-0">
                              <p
                                className="font-['Figtree:Medium',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[#48ba77] text-[14px] text-nowrap whitespace-pre"
                                style={fontMedium}
                              >
                                ATS: 88%
                              </p>
                            </div>
                          </div>
                          <div
                            className="content-stretch flex gap-[8px] items-center relative shrink-0 icon-button"
                            style={{
                              cursor: 'default',
                              zIndex: 30,
                              position: 'relative',
                              pointerEvents: 'auto',
                              isolation: 'isolate',
                            }}
                          >
                            {isEditingResume ? (
                              <div
                                className="relative shrink-0 size-[16px] hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
                                onClick={handleSaveResume}
                                data-icon="check"
                                style={{ cursor: 'pointer' }}
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
                                      height: '16px',
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="relative shrink-0 size-[16px] hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out select-none border-0 bg-transparent p-0"
                                  onClick={handleEditResume}
                                  style={{
                                    userSelect: 'none',
                                    pointerEvents: 'auto',
                                    cursor: 'pointer',
                                    outline: 'none',
                                  }}
                                >
                                  <div
                                    className="absolute contents inset-0"
                                    style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                  >
                                    <img
                                      alt=""
                                      draggable="false"
                                      className="block max-w-none size-full"
                                      src={imgEditIcon}
                                      style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                    />
                                  </div>
                                </button>
                                <button
                                  type="button"
                                  className="relative shrink-0 size-[16px] hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out select-none border-0 bg-transparent p-0"
                                  onClick={handleDownloadResume}
                                  style={{
                                    userSelect: 'none',
                                    pointerEvents: 'auto',
                                    cursor: 'pointer',
                                    outline: 'none',
                                  }}
                                >
                                  <div
                                    className="absolute contents inset-0"
                                    style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                  >
                                    <img
                                      alt=""
                                      draggable="false"
                                      className="block max-w-none size-full"
                                      src={imgDownloadIcon}
                                      style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                    />
                                  </div>
                                </button>
                                <button
                                  type="button"
                                  className="relative shrink-0 size-[16px] hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out select-none border-0 bg-transparent p-0"
                                  onClick={handleCopyResume}
                                  style={{
                                    userSelect: 'none',
                                    pointerEvents: 'auto',
                                    cursor: 'pointer',
                                    outline: 'none',
                                  }}
                                >
                                  <div
                                    className="absolute contents inset-0"
                                    style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                  >
                                    {isResumeCopied ? (
                                      <img
                                        alt=""
                                        draggable="false"
                                        className="block max-w-none size-full"
                                        src={imgCheckIcon}
                                        style={{
                                          filter:
                                            'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)',
                                          width: '16px',
                                          height: '16px',
                                          pointerEvents: 'none',
                                          cursor: 'pointer',
                                        }}
                                      />
                                    ) : (
                                      <img
                                        alt=""
                                        draggable="false"
                                        className="block max-w-none size-full"
                                        src={imgCopyIcon}
                                        style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                      />
                                    )}
                                  </div>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {isEditingResume ? (
                          <div
                            ref={resumeContainerRef}
                            className="bg-v2-background-primary border border-solid box-border flex-1 flex gap-[12px] items-stretch p-[16px] relative rounded-[6px] shrink-0 w-full transition-all duration-200 ease-in-out hover:border-v2-border-light min-h-0"
                            style={resumeTextareaContainerStyle}
                            onClick={handleResumeContainerClick}
                            onMouseDown={handleResumeContainerMouseDown}
                            onMouseEnter={() => setIsResumeTextareaHovered(true)}
                            onMouseLeave={() => setIsResumeTextareaHovered(false)}
                          >
                            <textarea
                              ref={resumeTextareaRef}
                              value={resumeEditValue}
                              onChange={handleResumeTextareaChange}
                              onFocus={handleResumeTextareaFocus}
                              onBlur={handleResumeTextareaBlur}
                              placeholder=""
                              className="v2-scrollbar bg-transparent border-none outline-none w-full h-full resize-none text-[14px] leading-[20px] focus:ring-0 focus:ring-transparent focus:border-none focus:outline-none !shadow-none cursor-text overflow-y-auto"
                              style={{
                                ...resumeTextareaStyle,
                                lineHeight: '20px',
                              }}
                              rows={1}
                              autoComplete="off"
                              onClick={(e: React.MouseEvent<HTMLTextAreaElement>) => {
                                e.stopPropagation()
                              }}
                              onMouseDown={(e: React.MouseEvent<HTMLTextAreaElement>) => {
                                e.stopPropagation()
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="v2-scrollbar content-stretch flex flex-col gap-[4px] items-end justify-center relative shrink-0 w-full overflow-y-auto max-h-[320px]"
                            style={{
                              cursor: 'default',
                              pointerEvents: 'auto',
                              isolation: 'isolate',
                            }}
                          >
                            <div
                              className="font-['Figtree:Medium',sans-serif] leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-v2-text-secondary w-[min-content] whitespace-pre-wrap"
                              style={{
                                ...fontMedium,
                                cursor: 'default',
                                userSelect: 'text',
                                pointerEvents: 'auto',
                                isolation: 'isolate',
                              }}
                            >
                              {resumeContent.split('\n').map((line: string, index: number) => (
                                <p
                                  key={index}
                                  className="mb-0"
                                  style={{ cursor: 'text', pointerEvents: 'auto' }}
                                >
                                  {line || '\u00A0'}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Generated Cover Letter Card */}
                      <div
                        className="basis-0 bg-[#1a1b1e] box-border content-stretch flex flex-col gap-[8px] grow h-[400px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shrink-0"
                        style={{ isolation: 'isolate' }}
                      >
                        <div
                          className="content-stretch flex items-center justify-between relative shrink-0 w-full"
                          style={{ isolation: 'isolate', zIndex: 1 }}
                        >
                          <p
                            className="font-['Figtree:SemiBold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[18px] text-v2-text-primary text-nowrap whitespace-pre"
                            style={fontSemibold}
                          >
                            Generated cover letter
                          </p>
                          <div
                            className="content-stretch flex gap-[8px] items-center relative shrink-0 icon-button"
                            style={{ cursor: 'default', zIndex: 10, position: 'relative' }}
                          >
                            {isEditingCoverLetter ? (
                              <div
                                className="relative shrink-0 size-[16px] cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
                                onClick={handleSaveCoverLetter}
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
                                      height: '16px',
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="relative shrink-0 size-[16px] hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out select-none border-0 bg-transparent p-0"
                                  onClick={handleEditCoverLetter}
                                  style={{
                                    userSelect: 'none',
                                    pointerEvents: 'auto',
                                    cursor: 'pointer',
                                    outline: 'none',
                                  }}
                                >
                                  <div
                                    className="absolute contents inset-0"
                                    style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                  >
                                    <img
                                      alt=""
                                      draggable="false"
                                      className="block max-w-none size-full"
                                      src={imgEditIcon}
                                      style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                    />
                                  </div>
                                </button>
                                <button
                                  type="button"
                                  className="relative shrink-0 size-[16px] hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out select-none border-0 bg-transparent p-0"
                                  onClick={handleDownloadCoverLetter}
                                  style={{
                                    userSelect: 'none',
                                    pointerEvents: 'auto',
                                    cursor: 'pointer',
                                    outline: 'none',
                                  }}
                                >
                                  <div
                                    className="absolute contents inset-0"
                                    style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                  >
                                    <img
                                      alt=""
                                      draggable="false"
                                      className="block max-w-none size-full"
                                      src={imgDownloadIcon}
                                      style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                    />
                                  </div>
                                </button>
                                <button
                                  type="button"
                                  className="relative shrink-0 size-[16px] hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out select-none border-0 bg-transparent p-0"
                                  onClick={handleCopyCoverLetter}
                                  style={{
                                    userSelect: 'none',
                                    pointerEvents: 'auto',
                                    cursor: 'pointer',
                                    outline: 'none',
                                  }}
                                >
                                  <div
                                    className="absolute contents inset-0"
                                    style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                  >
                                    {isCoverLetterCopied ? (
                                      <img
                                        alt=""
                                        draggable="false"
                                        className="block max-w-none size-full"
                                        src={imgCheckIcon}
                                        style={{
                                          filter:
                                            'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)',
                                          width: '16px',
                                          height: '16px',
                                          pointerEvents: 'none',
                                          cursor: 'pointer',
                                        }}
                                      />
                                    ) : (
                                      <img
                                        alt=""
                                        draggable="false"
                                        className="block max-w-none size-full"
                                        src={imgCopyIcon}
                                        style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                      />
                                    )}
                                  </div>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {isEditingCoverLetter ? (
                          <div
                            ref={coverLetterContainerRef}
                            className="bg-v2-background-primary border border-solid box-border flex-1 flex gap-[12px] items-stretch p-[16px] relative rounded-[6px] shrink-0 w-full transition-all duration-200 ease-in-out hover:border-v2-border-light min-h-0"
                            style={coverLetterTextareaContainerStyle}
                            onClick={handleCoverLetterContainerClick}
                            onMouseDown={handleCoverLetterContainerMouseDown}
                            onMouseEnter={() => setIsCoverLetterTextareaHovered(true)}
                            onMouseLeave={() => setIsCoverLetterTextareaHovered(false)}
                          >
                            <textarea
                              ref={coverLetterTextareaRef}
                              value={coverLetterEditValue}
                              onChange={handleCoverLetterTextareaChange}
                              onFocus={handleCoverLetterTextareaFocus}
                              onBlur={handleCoverLetterTextareaBlur}
                              placeholder=""
                              className="v2-scrollbar bg-transparent border-none outline-none w-full h-full resize-none text-[14px] leading-[20px] focus:ring-0 focus:ring-transparent focus:border-none focus:outline-none !shadow-none cursor-text overflow-y-auto"
                              style={{
                                ...coverLetterTextareaStyle,
                                lineHeight: '20px',
                              }}
                              rows={1}
                              autoComplete="off"
                              onClick={(e: React.MouseEvent<HTMLTextAreaElement>) => {
                                e.stopPropagation()
                              }}
                              onMouseDown={(e: React.MouseEvent<HTMLTextAreaElement>) => {
                                e.stopPropagation()
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="v2-scrollbar content-stretch flex flex-col gap-[4px] items-end justify-center relative shrink-0 w-full overflow-y-auto max-h-[320px]"
                            style={{ cursor: 'default' }}
                          >
                            <div
                              className="font-['Figtree:Medium',sans-serif] leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-v2-text-secondary w-[min-content] whitespace-pre-wrap"
                              style={{
                                ...fontMedium,
                                cursor: 'default',
                                userSelect: 'text',
                              }}
                            >
                              {coverLetterContent.split('\n').map((line: string, index: number) => (
                                <p key={index} className="mb-0" style={{ cursor: 'text' }}>
                                  {line || '\u00A0'}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Improvements Section */}
                    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
                      {/* Improvements Column */}
                      <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                          <p
                            className="font-['Figtree:SemiBold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[18px] text-v2-text-primary text-nowrap whitespace-pre"
                            style={fontSemibold}
                          >
                            Improvements made
                          </p>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation()
                              handleToggleImprovements()
                            }}
                            className="flex items-center justify-center relative shrink-0 cursor-pointer transition-transform duration-200 ease-in-out hover:opacity-80"
                            style={{
                              transform: isImprovementsExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                              pointerEvents: 'auto',
                              zIndex: 10,
                            }}
                          >
                            <div className="relative shrink-0 size-[24px] pointer-events-none">
                              <img
                                alt=""
                                className="block max-w-none size-full"
                                src={imgDropdownIcon}
                              />
                            </div>
                          </button>
                        </div>
                        <div
                          ref={improvementsRef}
                          className="overflow-hidden"
                          style={{
                            maxHeight: isImprovementsExpanded ? '1000px' : '0px',
                            opacity: isImprovementsExpanded ? 1 : 0,
                            transition:
                              'max-height 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                            willChange: 'max-height, opacity',
                          }}
                        >
                          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full pt-[0px]">
                            {/* Keywords Section */}
                            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                              <p
                                className="font-['Figtree:Medium',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[#7296ac] text-[14px] uppercase w-full"
                                style={fontMedium}
                              >
                                Keywords added
                              </p>
                              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full flex-wrap">
                                <div className="bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[40px] shrink-0">
                                  <p
                                    className="font-['Figtree:Medium',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                                    style={fontMedium}
                                  >
                                    Interface design
                                  </p>
                                </div>
                                <div className="bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[40px] shrink-0">
                                  <p
                                    className="font-['Figtree:Medium',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                                    style={fontMedium}
                                  >
                                    Product design
                                  </p>
                                </div>
                                <div className="bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[40px] shrink-0">
                                  <p
                                    className="font-['Figtree:Medium',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                                    style={fontMedium}
                                  >
                                    Management
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Modifications Section */}
                            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                              <p
                                className="font-['Figtree:Medium',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[#7296ac] text-[14px] uppercase w-full"
                                style={fontMedium}
                              >
                                modifications made
                              </p>
                              <div className="relative shrink-0 w-full">
                                {[
                                  {
                                    original:
                                      'Redesigned the expense management function, integrating AI-driven OCR',
                                    improved:
                                      'Redesigned the funding management function, implementing AI-driven OCR',
                                  },
                                ].map((modification, index) => (
                                  <div key={index} className="relative w-full">
                                    {/* Original text with red background */}
                                    <div className="border-[#d37e76] border-l-[1px] border-solid box-border bg-[#311614] h-[40px] relative">
                                      <p
                                        className="font-['Figtree:Medium',sans-serif] leading-[20px] not-italic text-[14px] text-v2-text-secondary absolute inset-0 flex items-center px-[10px]"
                                        style={fontMedium}
                                      >
                                        {modification.original}
                                      </p>
                                    </div>
                                    {/* Improved text with green background */}
                                    <div className="border-[#48ba77] border-l-[1px] border-solid box-border bg-[#123520] h-[40px] relative">
                                      <p
                                        className="font-['Figtree:Medium',sans-serif] leading-[20px] not-italic text-[14px] text-v2-text-secondary absolute inset-0 flex items-center px-[10px]"
                                        style={fontMedium}
                                      >
                                        {modification.improved}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Original Resume Column */}
                      <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                          <p
                            className="font-['Figtree:SemiBold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[18px] text-v2-text-primary text-nowrap whitespace-pre"
                            style={fontSemibold}
                          >
                            Original resume
                          </p>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation()
                              handleToggleOriginalResume()
                            }}
                            className="flex items-center justify-center relative shrink-0 cursor-pointer transition-transform duration-200 ease-in-out hover:opacity-80"
                            style={{
                              transform: isOriginalResumeExpanded
                                ? 'rotate(0deg)'
                                : 'rotate(180deg)',
                              transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                              pointerEvents: 'auto',
                              zIndex: 10,
                            }}
                          >
                            <div className="relative shrink-0 size-[24px] pointer-events-none">
                              <img
                                alt=""
                                className="block max-w-none size-full"
                                src={imgDropdownIcon}
                              />
                            </div>
                          </button>
                        </div>
                        <div
                          ref={originalResumeRef}
                          className="overflow-hidden"
                          style={{
                            maxHeight: isOriginalResumeExpanded ? '1000px' : '0px',
                            opacity: isOriginalResumeExpanded ? 1 : 0,
                            transition:
                              'max-height 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                            willChange: 'max-height, opacity',
                          }}
                        >
                          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full pt-[0px]">
                            <div className="v2-scrollbar content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full overflow-y-auto max-h-[400px]">
                              <div
                                className="font-['Figtree:Medium',sans-serif] leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-v2-text-secondary w-full whitespace-pre-wrap"
                                style={fontMedium}
                              >
                                <p className="mb-0">Oluwatosin Kazeem</p>
                                <p className="mb-0">
                                  Lagos, Nigeria | supremeux@gmail.com | LinkedIn URL | Portfolio
                                </p>
                                <p className="mb-0">&nbsp;</p>
                                <p className="mb-0">WORK EXPERIENCE</p>
                                <p className="mb-0">&nbsp;</p>
                                <p className="mb-0">Autospend Lagos, Nigeria</p>
                                <p className="mb-0">Product Designer 2023 - Present</p>
                                <p className="mb-0">
                                  Owned the design and development of a comprehensive design system,
                                  enhancing product release cycles by 25% and ensuring a consistent,
                                  visually polished user experience across the FinTech platform.
                                </p>
                                <p className="mb-0">
                                  Redesigned the expense management function, integrating AI-driven
                                  OCR automation to reduce manual data entry by 20% and improve user
                                  satisfaction.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OptimizeResumeModal
        isOpen={isOptimizeResumeModalOpen}
        onClose={() => setIsOptimizeResumeModalOpen(false)}
        onSubmit={handleOptimizeResumeSubmit}
      />
    </div>
  )
}
