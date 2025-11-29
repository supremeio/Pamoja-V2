'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { typography } from '@/lib/typography/v2'
import { colorValues, iconFilters } from '@/lib/colors/v2'
import { createTransition } from '@/lib/transitions/v2'
import { FileUpload, FileUploadState } from './FileUpload'
import { Separator } from './Separator'
import { TextField } from './TextField'
import { Checkbox } from './Checkbox'

const fontMedium = typography.medium
const fontSemibold = typography.semibold

// Icon assets from local icon library
const imgCloseIcon = '/icons/v2/close-icon.svg'
const imgArrowRight = '/icons/v2/Button arrow roght.svg'
const imgArrowLeft = '/icons/v2/Button arrow left.svg'
const imgCheckIcon = '/icons/v2/check-icon.svg'
const imgLaunchIcon = '/icons/v2/Launch icon.svg'
const imgFlashIcon = '/icons/v2/quick-icon.svg'

interface SetUpAIAgentModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

type SetupStage = 1 | 2 | 3

export function SetUpAIAgentModal({ isOpen, onClose, onComplete }: SetUpAIAgentModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStage, setCurrentStage] = useState<SetupStage>(1)
  const [isStageTransitioning, setIsStageTransitioning] = useState(false)

  // Stage 1: Resume upload
  const [uploadState, setUploadState] = useState<FileUploadState>('default')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const uploadProgressIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Stage 2: Preferences
  const [preferences, setPreferences] = useState({
    jobRole: '',
    location: '',
    salaryRange: '',
    workTypes: ['remote', 'on-site'] as string[], // Default: Remote and On-site checked
  })

  // Helper to get label from value
  const getLabelFromValue = useCallback(
    (value: string, options: Array<{ label: string; value: string }>) => {
      const option = options.find(opt => opt.value === value)
      return option ? option.label : value
    },
    []
  )

  const jobRoleOptions = [
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
    { label: 'Other', value: 'other' },
  ]

  const locationOptions = [
    { label: 'Remote', value: 'remote' },
    { label: 'New York, NY', value: 'new-york' },
    { label: 'San Francisco, CA', value: 'san-francisco' },
    { label: 'Los Angeles, CA', value: 'los-angeles' },
    { label: 'Chicago, IL', value: 'chicago' },
    { label: 'Austin, TX', value: 'austin' },
    { label: 'Seattle, WA', value: 'seattle' },
    { label: 'Boston, MA', value: 'boston' },
    { label: 'London, UK', value: 'london' },
    { label: 'Toronto, Canada', value: 'toronto' },
    { label: 'Other', value: 'other' },
  ]

  const salaryRangeOptions = [
    { label: '$50k - $75k', value: '50-75k' },
    { label: '$75k - $100k', value: '75-100k' },
    { label: '$100k - $125k', value: '100-125k' },
    { label: '$125k - $150k', value: '125-150k' },
    { label: '$150k - $175k', value: '150-175k' },
    { label: '$175k - $200k', value: '175-200k' },
    { label: '$200k+', value: '200k-plus' },
    { label: 'Not specified', value: 'not-specified' },
  ]

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      setIsAnimating(false)
      setCurrentStage(1)
      setUploadState('default')
      setUploadProgress(0)
      setUploadError(null)
      setUploadedFileName(null)
      setPreferences({
        jobRole: '',
        location: '',
        salaryRange: '',
        workTypes: ['remote', 'on-site'],
      })
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

  // Cleanup upload progress interval
  useEffect(() => {
    return () => {
      if (uploadProgressIntervalRef.current) {
        clearInterval(uploadProgressIntervalRef.current)
      }
    }
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
          return 100
        }
        return prev + 10
      })
    }, 200)
  }, [])

  const handleDeleteUpload = useCallback(() => {
    setUploadState('default')
    setUploadProgress(0)
    setUploadError(null)
    setUploadedFileName(null)
    if (uploadProgressIntervalRef.current) {
      clearInterval(uploadProgressIntervalRef.current)
    }
  }, [])

  const handlePreferenceChange = useCallback((field: string, value: string) => {
    setPreferences(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleWorkTypeToggle = useCallback((workType: string) => {
    setPreferences(prev => {
      const currentTypes = prev.workTypes
      const isChecked = currentTypes.includes(workType)
      if (isChecked) {
        return { ...prev, workTypes: currentTypes.filter(t => t !== workType) }
      } else {
        return { ...prev, workTypes: [...currentTypes, workType] }
      }
    })
  }, [])

  const handleContinue = useCallback(() => {
    if (currentStage === 1) {
      // Validate resume is uploaded
      if (uploadState !== 'uploaded' || !uploadedFileName) {
        return
      }
      setIsStageTransitioning(true)
      setTimeout(() => {
        setCurrentStage(2)
        setIsStageTransitioning(false)
      }, 150)
    } else if (currentStage === 2) {
      // Validate preferences (at least job role should be selected)
      if (!preferences.jobRole) {
        return
      }
      setIsStageTransitioning(true)
      setTimeout(() => {
        setCurrentStage(3)
        setIsStageTransitioning(false)
      }, 150)
    } else if (currentStage === 3) {
      // Complete setup
      onComplete?.()
      onClose()
    }
  }, [currentStage, uploadState, uploadedFileName, preferences, onComplete, onClose])

  const handleBack = useCallback(() => {
    if (currentStage > 1) {
      setIsStageTransitioning(true)
      setTimeout(() => {
        setCurrentStage(prev => (prev - 1) as SetupStage)
        setIsStageTransitioning(false)
      }, 150)
    }
  }, [currentStage])

  const overlayStyle: React.CSSProperties = {
    backgroundColor: colorValues.overlay,
    opacity: isAnimating ? 1 : 0,
    transition: isMounted ? createTransition(['opacity'], 'slow') : 'none',
    pointerEvents: (isAnimating ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isMounted ? 'visible' : 'hidden') as React.CSSProperties['visibility'],
  }

  const modalLeftStyle: React.CSSProperties = {
    left: 'calc(100vw - 480px - 24px)',
    transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
    transition: isMounted
      ? 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)'
      : 'none',
    opacity: isAnimating ? 1 : 0,
    pointerEvents: (isAnimating ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isMounted ? 'visible' : 'hidden') as React.CSSProperties['visibility'],
    willChange: 'transform, opacity',
  }

  // Stage content transition for smooth flow
  const stageContentStyle: React.CSSProperties = {
    opacity: isAnimating && !isStageTransitioning ? 1 : 0,
    transition: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  }

  if (!isMounted) {
    return null
  }

  const canContinue =
    (currentStage === 1 && uploadState === 'uploaded' && uploadedFileName) ||
    (currentStage === 2 && preferences.jobRole) ||
    currentStage === 3

  return (
    <>
      <div className="fixed inset-0" style={{ ...overlayStyle, zIndex: 9999 }} onClick={onClose} />
      <div
        className="fixed bg-v2-background-primary border border-v2-border border-solid box-border flex flex-col right-0 top-[24px] bottom-[24px] rounded-[12px] w-[480px]"
        style={{ ...modalLeftStyle, zIndex: 10000 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="content-stretch flex flex-col gap-[40px] items-end p-[16px] relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            {/* Header */}
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
              <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px not-italic relative shrink-0">
                <p
                  className="leading-[28px] relative shrink-0 text-[18px] text-v2-text-primary w-full"
                  style={fontSemibold}
                >
                  Set up AI agent
                </p>
                <p
                  className="leading-[20px] relative shrink-0 text-[14px] text-v2-text-secondary w-full"
                  style={fontMedium}
                >
                  Our AI will analyze your experience, skills, and career goals
                </p>
              </div>
              <button
                onClick={onClose}
                className="overflow-clip relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 transition-opacity duration-200 ease-out"
                style={{ willChange: 'opacity' }}
                aria-label="Close modal"
              >
                <img alt="" className="block max-w-none size-full" src={imgCloseIcon} />
              </button>
            </div>

            {/* Progress indicator */}
            <div className="box-border content-stretch flex flex-col gap-[12px] items-start px-0 py-[24px] relative shrink-0 w-full">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <div
                  className="h-[8px] rounded-[40px] shrink-0 w-[54px]"
                  style={{
                    backgroundColor:
                      currentStage >= 1
                        ? currentStage === 3
                          ? '#123520'
                          : currentStage === 1
                            ? colorValues.success.primary
                            : '#123520'
                        : colorValues.background.secondary,
                  }}
                />
                <div
                  className="h-[8px] rounded-[40px] shrink-0 w-[54px]"
                  style={{
                    backgroundColor:
                      currentStage >= 2
                        ? currentStage === 3
                          ? '#123520'
                          : colorValues.success.primary
                        : colorValues.background.secondary,
                  }}
                />
                <div
                  className="h-[8px] rounded-[40px] shrink-0 w-[54px]"
                  style={{
                    backgroundColor:
                      currentStage >= 3
                        ? colorValues.success.primary
                        : colorValues.background.secondary,
                  }}
                />
              </div>
              <p
                className="leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-v2-text-primary whitespace-pre"
                style={fontMedium}
              >
                {currentStage === 1 && 'Upload your resume'}
                {currentStage === 2 && 'Set your job preferences'}
                {currentStage === 3 && 'Launch AI agent'}
              </p>
            </div>

            {/* Stage content */}
            <div
              className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full"
              style={stageContentStyle}
            >
              {currentStage === 1 && (
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                    <div className="bg-v2-background-primary border border-v2-border border-solid box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full">
                      <p
                        className="leading-[28px] not-italic relative shrink-0 text-[18px] text-v2-text-primary text-nowrap whitespace-pre"
                        style={fontSemibold}
                      >
                        Your resume
                      </p>
                      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                        <Separator />
                        <FileUpload
                          onFileSelect={handleFileSelect}
                          onDelete={handleDeleteUpload}
                          fileName={uploadedFileName || undefined}
                          uploadProgress={uploadProgress}
                          errorMessage={uploadError || undefined}
                          state={uploadState}
                          accept=".pdf,.doc,.docx"
                          fullWidth={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStage === 2 && (
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                    {/* Target role */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <p
                        className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-muted w-full"
                        style={fontMedium}
                      >
                        Target role
                      </p>
                      <TextField
                        label=""
                        placeholder="Select role(s)"
                        value={preferences.jobRole}
                        onChange={value => handlePreferenceChange('jobRole', value)}
                        variant="dropdown"
                        width="100%"
                        dropdownOptions={jobRoleOptions}
                        onDropdownSelect={value => handlePreferenceChange('jobRole', value)}
                        showHelperText={false}
                      />
                    </div>

                    {/* Work arrangement checkboxes */}
                    <div className="content-stretch flex gap-[24px] items-start relative shrink-0">
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
                        <Checkbox
                          checked={preferences.workTypes.includes('remote')}
                          onChange={() => handleWorkTypeToggle('remote')}
                        />
                        <p
                          className="leading-[24px] not-italic relative shrink-0 text-[15px] text-v2-text-muted text-nowrap tracking-[-0.15px] whitespace-pre"
                          style={fontMedium}
                        >
                          Remote
                        </p>
                      </div>
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
                        <Checkbox
                          checked={preferences.workTypes.includes('on-site')}
                          onChange={() => handleWorkTypeToggle('on-site')}
                        />
                        <p
                          className="leading-[24px] not-italic relative shrink-0 text-[15px] text-v2-text-muted text-nowrap tracking-[-0.15px] whitespace-pre"
                          style={fontMedium}
                        >
                          On-site
                        </p>
                      </div>
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
                        <Checkbox
                          checked={preferences.workTypes.includes('hybrid')}
                          onChange={() => handleWorkTypeToggle('hybrid')}
                        />
                        <p
                          className="leading-[24px] not-italic relative shrink-0 text-[15px] text-v2-text-muted text-nowrap tracking-[-0.15px] whitespace-pre"
                          style={fontMedium}
                        >
                          Hybrid
                        </p>
                      </div>
                    </div>

                    {/* Preferred locations */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <p
                        className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-muted w-full"
                        style={fontMedium}
                      >
                        Preferred locations
                      </p>
                      <TextField
                        label=""
                        placeholder="Select location"
                        value={preferences.location}
                        onChange={value => handlePreferenceChange('location', value)}
                        variant="dropdown"
                        width="100%"
                        dropdownOptions={locationOptions}
                        onDropdownSelect={value => handlePreferenceChange('location', value)}
                        showHelperText={false}
                        disabled={
                          preferences.workTypes.length === 1 &&
                          preferences.workTypes.includes('remote')
                        }
                      />
                    </div>

                    {/* Salary range */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <p
                        className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-muted w-full"
                        style={fontMedium}
                      >
                        Salary range
                      </p>
                      <TextField
                        label=""
                        placeholder="E.g, $120K - $180K"
                        value={preferences.salaryRange}
                        onChange={value => handlePreferenceChange('salaryRange', value)}
                        variant="dropdown"
                        width="100%"
                        dropdownOptions={salaryRangeOptions}
                        onDropdownSelect={value => handlePreferenceChange('salaryRange', value)}
                        showHelperText={false}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStage === 3 && (
                <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
                  {/* Success Message Section */}
                  <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0">
                    {/* Flash Icon */}
                    <div className="overflow-clip relative shrink-0 size-[40px]">
                      <img
                        alt=""
                        className="block max-w-none size-full"
                        src={imgFlashIcon}
                        style={{
                          filter: iconFilters.greenCheck,
                          width: '40px',
                          height: '40px',
                        }}
                      />
                    </div>
                    {/* Success Text */}
                    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0">
                      <p
                        className="leading-[28px] not-italic relative shrink-0 text-[18px] text-v2-text-primary text-nowrap whitespace-pre"
                        style={fontSemibold}
                      >
                        You're all set!
                      </p>
                      <p
                        className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-secondary text-center"
                        style={fontMedium}
                      >
                        Your AI agent is ready to start finding and applying to jobs
                      </p>
                    </div>
                  </div>

                  {/* Setup Summary Card */}
                  <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-0 py-[24px] relative shrink-0 w-full">
                    <div className="bg-v2-background-secondary box-border content-stretch flex flex-col gap-[8px] items-start justify-center p-[24px] relative rounded-[8px] shrink-0 w-full">
                      {/* Header */}
                      <p
                        className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-nowrap uppercase whitespace-pre"
                        style={{ ...fontMedium, color: colorValues.status.offer.text }}
                      >
                        Setup Summary
                      </p>

                      {/* Summary Items */}
                      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                        {/* Resume */}
                        {uploadedFileName && (
                          <div className="border-[0px_0px_1px] border-v2-border border-solid box-border content-stretch flex items-center justify-between px-0 py-[12px] relative shrink-0 w-full">
                            <p
                              className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-secondary text-nowrap whitespace-pre"
                              style={fontMedium}
                            >
                              Resume
                            </p>
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                              <div
                                className="overflow-clip relative shrink-0"
                                style={{ width: '20px', height: '20px' }}
                              >
                                <img
                                  alt=""
                                  className="block max-w-none"
                                  src={imgCheckIcon}
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    filter: iconFilters.greenCheck,
                                  }}
                                />
                              </div>
                              <p
                                className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                                style={fontMedium}
                              >
                                {uploadedFileName}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Target Role */}
                        {preferences.jobRole && (
                          <div className="border-[0px_0px_1px] border-v2-border border-solid box-border content-stretch flex items-center justify-between px-0 py-[12px] relative shrink-0 w-full">
                            <p
                              className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-secondary text-nowrap whitespace-pre"
                              style={fontMedium}
                            >
                              Target
                            </p>
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                              <p
                                className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                                style={fontMedium}
                              >
                                {getLabelFromValue(preferences.jobRole, jobRoleOptions)}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Locations */}
                        <div className="border-[0px_0px_1px] border-v2-border border-solid box-border content-stretch flex items-center justify-between px-0 py-[12px] relative shrink-0 w-full">
                          <p
                            className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-secondary text-nowrap whitespace-pre"
                            style={fontMedium}
                          >
                            Locations
                          </p>
                          <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                            <p
                              className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                              style={fontMedium}
                            >
                              {preferences.workTypes
                                .map(type => {
                                  const formatted =
                                    type.charAt(0).toUpperCase() + type.slice(1).replace('-', '-')
                                  return formatted === 'On-site' ? 'On-site' : formatted
                                })
                                .join(', ')}
                              {preferences.location && preferences.workTypes.length > 0 && ', '}
                              {preferences.location &&
                                getLabelFromValue(preferences.location, locationOptions)}
                            </p>
                          </div>
                        </div>

                        {/* Credits */}
                        <div className="box-border content-stretch flex items-center justify-between px-0 py-[12px] relative shrink-0 w-full">
                          <p
                            className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-secondary text-nowrap whitespace-pre"
                            style={fontMedium}
                          >
                            Credits available
                          </p>
                          <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                            <p
                              className="leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre"
                              style={{ ...fontMedium, color: colorValues.success.primary }}
                            >
                              500 credits
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with Back and Continue buttons */}
          <div className="content-stretch flex gap-[8px] items-start justify-end relative shrink-0 w-full">
            {currentStage > 1 && currentStage !== 3 && (
              <button
                onClick={handleBack}
                className="bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-[120px] cursor-pointer transition-opacity duration-200 ease-out hover:opacity-90"
                style={{ willChange: 'opacity' }}
              >
                <div className="relative shrink-0 size-[20px]">
                  <div className="absolute contents inset-0">
                    <img alt="" className="block max-w-none size-full" src={imgArrowLeft} />
                  </div>
                </div>
                <p
                  className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                  style={fontMedium}
                >
                  Back
                </p>
              </button>
            )}
            {currentStage === 3 ? (
              <button
                onClick={handleContinue}
                className="basis-0 bg-v2-brand-primary box-border content-stretch flex gap-[4px] grow items-center justify-center min-h-px min-w-px px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-opacity duration-200 ease-out hover:opacity-90"
                style={{ willChange: 'opacity' }}
              >
                <div className="overflow-clip relative shrink-0 size-[20px]">
                  <img alt="" className="block max-w-none size-full" src={imgLaunchIcon} />
                </div>
                <p
                  className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                  style={fontMedium}
                >
                  Launch AI agent
                </p>
              </button>
            ) : (
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className="bg-v2-brand-primary box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-opacity duration-200 ease-out hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ willChange: 'opacity' }}
              >
                <p
                  className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                  style={fontMedium}
                >
                  Continue
                </p>
                <div className="relative shrink-0 size-[20px]">
                  <div className="absolute contents inset-0">
                    <img alt="" className="block max-w-none size-full" src={imgArrowRight} />
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
