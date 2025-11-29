'use client'

import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react'
import { SideNavigation } from '@/components/v2/SideNavigation'
import { TopNavigation } from '@/components/v2/TopNavigation'
import { ApplicationActionsMenu } from '@/components/v2/ApplicationActionsMenu'
import { Separator } from '@/components/v2/Separator'
import { useToast, toast } from '@/components/v2/Toast'
import { typography } from '@/lib/typography/v2'
import { getStatusLabel, getStatusStyles } from '@/lib/utils/v2/applicationStatus'
import { calculateMenuPosition } from '@/lib/utils/v2/menuPosition'

// Lazy load modals for better performance - only load when needed
const ApplyJobModal = lazy(() => import('@/components/v2/ApplyJobModal').then(m => ({ default: m.ApplyJobModal })))
const AddApplicationModal = lazy(() => import('@/components/v2/AddApplicationModal').then(m => ({ default: m.AddApplicationModal })))
const GenerateCoverLetterModal = lazy(() => import('@/components/v2/GenerateCoverLetterModal').then(m => ({ default: m.GenerateCoverLetterModal })))
const DeleteApplicationModal = lazy(() => import('@/components/v2/DeleteApplicationModal').then(m => ({ default: m.DeleteApplicationModal })))

// Loading fallback for modals
const ModalLoader = () => null

const fontStyle = { fontFamily: typography.medium.fontFamily }
const fontMedium = typography.medium
const fontSemibold = typography.semibold
const fontRegular = typography.regular

const img6 = "/icons/v2/more-icon.svg" // More icon for actions menu
const img7 = "/icons/v2/prev-page-icon.svg" // Previous page icon (pagination)
const img8 = "/icons/v2/next-page-icon.svg" // Next page icon (pagination)

// Memoized styles to avoid recreating on every render
const paginationIconStyle = { width: '20px', height: '20px' } as const

function Applications() {
  const { showToast } = useToast()
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [isAddApplicationModalOpen, setIsAddApplicationModalOpen] = useState(false)
  const [isGenerateCoverLetterModalOpen, setIsGenerateCoverLetterModalOpen] = useState(false)
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentStatus, setCurrentStatus] = useState('applied')
  const actionsMenuButtonRef = useRef<HTMLDivElement>(null)
  const [actionsMenuPosition, setActionsMenuPosition] = useState({ top: 395, left: 1022 })

  const handleApplyClick = useCallback(() => {
    setIsApplyModalOpen(true)
  }, [])

  const handleApplySubmit = useCallback(async (data: {
    company: string
    role: string
    jobDescription: string
    resumeText: string
  }) => {
    // TODO: Implement application saving functionality and API integration
  }, [])

  const handleMenuItemClick = useCallback((action: string) => {
    // Use requestAnimationFrame for immediate execution on next frame
    requestAnimationFrame(() => {
      if (action === 'add-application') {
        setIsAddApplicationModalOpen(true)
      } else if (action === 'generate-cover-letter') {
        setIsGenerateCoverLetterModalOpen(true)
      }
    })
  }, [])

  const handleAddApplicationSubmit = useCallback(async (data: {
    company: string
    role: string
    dateApplied: string
    atsScore: string
    status: string
  }) => {
    // TODO: Implement add application functionality and API integration
    showToast(toast.success('Application added successfully'))
    setIsAddApplicationModalOpen(false)
  }, [showToast])

  const handleGenerateCoverLetterSubmit = useCallback(async (data: {
    company: string
    role: string
    jobDescription: string
    resumeText: string
  }) => {
    // TODO: Implement generate cover letter functionality and API integration
  }, [])

  const calculatePosition = useCallback(() => {
    const position = calculateMenuPosition(actionsMenuButtonRef)
    if (position) {
      setActionsMenuPosition(position)
    }
  }, [])

  useEffect(() => {
    if (isActionsMenuOpen) {
      calculatePosition()
      window.addEventListener('resize', calculatePosition)
      window.addEventListener('scroll', calculatePosition, true)
      return () => {
        window.removeEventListener('resize', calculatePosition)
        window.removeEventListener('scroll', calculatePosition, true)
      }
    }
  }, [isActionsMenuOpen, calculatePosition])

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (isActionsMenuOpen && actionsMenuButtonRef.current) {
      const target = event.target as Node
      if (!actionsMenuButtonRef.current.contains(target)) {
        const menuElement = document.querySelector('[data-application-menu]')
        if (!menuElement || !menuElement.contains(target)) {
          setIsActionsMenuOpen(false)
        }
      }
    }
  }, [isActionsMenuOpen])

  useEffect(() => {
    if (isActionsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside, true)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true)
      }
    }
  }, [isActionsMenuOpen, handleClickOutside])

  const handleActionsMenuClick = useCallback(() => {
    setIsActionsMenuOpen(prev => !prev)
  }, [])

  const handleActionsMenuClose = useCallback(() => {
    setIsActionsMenuOpen(false)
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    setCurrentStatus(status)
    // TODO: Implement status update API call
  }, [])

  const handleComposeReminder = useCallback(() => {
    // TODO: Implement compose reminder email functionality
  }, [])

  const handleDeleteApplication = useCallback(() => {
    setIsDeleteModalOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    // TODO: Implement delete application API call
    showToast(toast.success('Application deleted successfully'))
    setIsDeleteModalOpen(false)
  }, [showToast])


  return (
    <div className="bg-v2-background-primary content-stretch flex flex-col gap-[40px] items-center relative w-full min-h-screen" style={fontStyle}>
      {/* Header */}
      <TopNavigation onMenuItemClick={handleMenuItemClick} />
      {/* Main content */}
      <div className="basis-0 box-border content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px px-[80px] py-0 relative shrink-0 w-full">
        <div className="basis-0 content-stretch flex gap-[40px] grow items-start min-h-px min-w-px relative shrink-0 w-full">
          <SideNavigation className="box-border content-stretch flex flex-col gap-[17px] h-full items-start p-[24px] relative rounded-[16px] shrink-0 w-[280px]" />
          <div className="basis-0 box-border content-stretch flex flex-col gap-[40px] grow h-full items-start min-h-px min-w-px p-[24px] relative shrink-0 transition-all duration-300 ease-in-out">
            {/* Applications header */}
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0">
                <p className="leading-[1.5] relative shrink-0 text-[18px] text-v2-text-primary w-full" style={fontSemibold}>
                  Applications
                </p>
                <p className="leading-[1.7] relative shrink-0 text-[14px] text-v2-text-secondary w-full" style={fontMedium}>
                  Track and manage your job applications
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <button 
                  onClick={() => setIsAddApplicationModalOpen(true)}
                  className="bg-v2-background-secondary box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
                    Add application
                  </p>
                </button>
                <button
                  onClick={handleApplyClick}
                  className="bg-v2-brand-primary box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="relative shrink-0 size-[20px]">
                    <div className="absolute contents inset-0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="block max-w-none size-full">
                        <path d="M5 10H15" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 15V5" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
                    Optimize & apply
                  </p>
                </button>
              </div>
            </div>
            {/* Applications table */}
            <div className="basis-0 bg-v2-background-primary content-stretch flex flex-col grow items-start justify-between min-h-px min-w-px relative rounded-[8px] shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  {/* Table header */}
                  <div className="content-stretch flex gap-[3px] items-center relative shrink-0 w-full">
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center min-h-px min-w-px p-[16px] relative shrink-0">
                      <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-secondary text-nowrap uppercase whitespace-pre" style={fontRegular}>
                        Company's name
                      </p>
                    </div>
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center min-h-px min-w-px p-[16px] relative shrink-0">
                      <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-secondary text-nowrap uppercase whitespace-pre" style={fontRegular}>
                        Role
                      </p>
                    </div>
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center min-h-px min-w-px p-[16px] relative shrink-0">
                      <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-secondary text-nowrap uppercase whitespace-pre" style={fontRegular}>
                        Date applied
                      </p>
                    </div>
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center justify-end min-h-px min-w-px p-[16px] relative shrink-0">
                      <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-secondary text-nowrap uppercase whitespace-pre" style={fontRegular}>
                        ATS score
                      </p>
                    </div>
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center min-h-px min-w-px p-[16px] relative shrink-0">
                      <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-secondary text-nowrap uppercase whitespace-pre" style={fontRegular}>
                        Status
                      </p>
                    </div>
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px p-[16px] relative shrink-0">
                      <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-secondary text-nowrap uppercase whitespace-pre" style={fontRegular}>
                        Actions
                      </p>
                    </div>
                  </div>
                  {/* Border line between header and row */}
                  <Separator />
                  {/* Table row */}
                  <div className="content-stretch flex gap-[3px] items-center relative shrink-0 w-full">
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center min-h-px min-w-px p-[16px] relative shrink-0">
                      <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
                        Autospend
                      </p>
                    </div>
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center min-h-px min-w-px p-[16px] relative shrink-0">
                      <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
                        Product designer
                      </p>
                    </div>
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center min-h-px min-w-px p-[16px] relative shrink-0">
                      <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
                        December 23,  2024
                      </p>
                    </div>
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center justify-end min-h-px min-w-px p-[16px] relative shrink-0">
                      <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
                        80%
                      </p>
                    </div>
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center min-h-px min-w-px px-[16px] py-[12px] relative shrink-0">
                      <div 
                        className="border border-solid box-border content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[40px] shrink-0 transition-all duration-300 ease-in-out"
                        style={getStatusStyles(currentStatus)}
                      >
                        <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre" style={fontMedium}>
                          {getStatusLabel(currentStatus)}
                        </p>
                      </div>
                    </div>
                    <div className="basis-0 box-border content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px p-[16px] relative shrink-0">
                      <div
                        ref={actionsMenuButtonRef}
                        className="box-border content-stretch flex gap-[10px] items-center p-[4px] relative rounded-[4px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:bg-v2-background-secondary hover:scale-110 active:scale-95"
                        onClick={handleActionsMenuClick}
                      >
                        <div className="overflow-clip relative shrink-0 size-[16px]">
                          <img alt="" className="block max-w-none size-full" src={img6} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Border line after row */}
                  <Separator />
                </div>
              </div>
              {/* Table footer with pagination */}
              <div className="border-[1px_0px_0px] border-v2-border border-solid box-border content-stretch flex items-center justify-between px-0 py-[20px] relative shrink-0 w-full">
                <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
                  Showing 1-5 of 5 applications
                </p>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                  <div className="relative shrink-0 size-[20px]">
                    <div className="absolute contents inset-0">
                      <img alt="" className="block max-w-none size-full" src={img7} style={paginationIconStyle} />
                    </div>
                  </div>
                  <p className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
                    Page 1 of 4
                  </p>
                  <div className="relative shrink-0 size-[20px]">
                    <div className="absolute contents inset-0">
                      <img alt="" className="block max-w-none size-full" src={img8} style={paginationIconStyle} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modals - Only render when open for better performance */}
      {isApplyModalOpen && (
        <Suspense fallback={<ModalLoader />}>
          <ApplyJobModal
            isOpen={isApplyModalOpen}
            onClose={() => setIsApplyModalOpen(false)}
            onSubmit={handleApplySubmit}
          />
        </Suspense>
      )}
      {isAddApplicationModalOpen && (
        <Suspense fallback={<ModalLoader />}>
          <AddApplicationModal
            isOpen={isAddApplicationModalOpen}
            onClose={() => setIsAddApplicationModalOpen(false)}
            onSubmit={handleAddApplicationSubmit}
          />
        </Suspense>
      )}
      {isGenerateCoverLetterModalOpen && (
        <Suspense fallback={<ModalLoader />}>
          <GenerateCoverLetterModal
            isOpen={isGenerateCoverLetterModalOpen}
            onClose={() => setIsGenerateCoverLetterModalOpen(false)}
            onSubmit={handleGenerateCoverLetterSubmit}
          />
        </Suspense>
      )}
      {isDeleteModalOpen && (
        <Suspense fallback={<ModalLoader />}>
          <DeleteApplicationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
          />
        </Suspense>
      )}
      {/* Application Actions Menu */}
      {isActionsMenuOpen && (
        <ApplicationActionsMenu
          isOpen={isActionsMenuOpen}
          onClose={handleActionsMenuClose}
          onStatusChange={handleStatusChange}
          onComposeReminder={handleComposeReminder}
          onDeleteApplication={handleDeleteApplication}
          currentStatus={currentStatus}
          position={actionsMenuPosition}
        />
      )}
    </div>
  )
}

export default React.memo(Applications)
