'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { TextField } from './TextField'
import { typography } from '@/lib/typography/v2'
import { colorValues } from '@/lib/colors/v2'
import { createTransition } from '@/lib/transitions/v2'

const fontMedium = typography.medium
const fontSemibold = typography.semibold

// Icon assets from local icon library
const imgCloseIcon = '/icons/v2/close-icon.svg'
const imgAddIcon = '/icons/v2/add-icon.svg'

interface AddApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: {
    company: string
    role: string
    dateApplied: string
    atsScore: string
    status: string
  }) => void
}

export function AddApplicationModal({ isOpen, onClose, onSubmit }: AddApplicationModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    dateApplied: '',
    atsScore: '',
    status: 'applied',
  })

  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
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

  const handleSubmit = useCallback(() => {
    onSubmit?.(formData)
    // Reset form
    setFormData({
      company: '',
      role: '',
      dateApplied: '',
      atsScore: '',
      status: 'applied',
    })
    onClose()
  }, [formData, onSubmit, onClose])

  const handleChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const isFormValid = formData.company && formData.role && formData.dateApplied && formData.status

  const overlayStyle: React.CSSProperties = {
    backgroundColor: colorValues.overlay,
    opacity: isAnimating ? 1 : 0,
    transition: isMounted ? createTransition(['opacity'], 'slow') : 'none',
    pointerEvents: (isAnimating ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isMounted ? 'visible' : 'hidden') as React.CSSProperties['visibility'],
    zIndex: 9999,
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
    zIndex: 10000,
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      <div className="fixed inset-0" style={overlayStyle} onClick={onClose} />
      <div
        className="fixed bg-v2-background-primary border border-v2-border border-solid box-border flex flex-col right-0 top-[24px] bottom-[24px] rounded-[12px] w-[480px]"
        style={modalLeftStyle}
        onClick={e => e.stopPropagation()}
      >
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full p-[16px] pb-[16px]">
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
            <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px not-italic relative shrink-0">
              <p
                className="leading-[28px] relative shrink-0 text-[18px] text-v2-text-primary w-full"
                style={fontSemibold}
              >
                Add application
              </p>
              <p
                className="leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-v2-text-secondary w-[min-content] whitespace-pre-wrap"
                style={fontMedium}
              >
                Add a new job application to track
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
              <p
                className="leading-[1.7] not-italic relative shrink-0 text-v2-text-accent text-[14px] text-nowrap uppercase whitespace-pre"
                style={fontMedium}
              >
                Application info
              </p>
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                <TextField
                  label="Company's name"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={value => handleChange('company', value)}
                  width="100%"
                  showIcon={false}
                />

                <TextField
                  label="Job role"
                  placeholder="Select job role"
                  value={formData.role}
                  onChange={value => handleChange('role', value)}
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
                    { label: 'Other', value: 'other' },
                  ]}
                  onDropdownSelect={value => handleChange('role', value)}
                />

                <TextField
                  label="Date applied"
                  placeholder="Select date"
                  value={formData.dateApplied}
                  onChange={value => handleChange('dateApplied', value)}
                  type="text"
                  width="100%"
                  showIcon={false}
                />

                <TextField
                  label="(Optional) ATS score"
                  placeholder="Enter ATS score"
                  value={formData.atsScore}
                  onChange={value => handleChange('atsScore', value)}
                  type="text"
                  width="100%"
                  showIcon={false}
                />

                <TextField
                  label="Status"
                  placeholder="Select status"
                  value={formData.status}
                  onChange={value => handleChange('status', value)}
                  variant="dropdown"
                  width="100%"
                  dropdownOptions={[
                    { label: 'Applied', value: 'applied' },
                    { label: 'Interview', value: 'interview' },
                    { label: 'Offer', value: 'offer' },
                    { label: 'Rejected', value: 'rejected' },
                  ]}
                  onDropdownSelect={value => handleChange('status', value)}
                  showIcon={true}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="content-stretch flex gap-[8px] items-start justify-end relative shrink-0 p-[16px] pt-[16px]">
          <button
            type="button"
            onClick={onClose}
            className="bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:bg-v2-background-primary hover:border-v2-border-light hover:scale-[1.02] active:scale-[0.98] active:opacity-90"
          >
            <p
              className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
              style={fontMedium}
            >
              Cancel
            </p>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-v2-brand-primary box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] active:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ willChange: 'opacity, transform' }}
          >
            <div className="relative shrink-0 size-[20px]">
              <div className="absolute contents inset-0">
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src={imgAddIcon}
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(1)',
                    width: '16px',
                    height: '16px',
                  }}
                />
              </div>
            </div>
            <p
              className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
              style={fontMedium}
            >
              Add application
            </p>
          </button>
        </div>
      </div>
    </>
  )
}
