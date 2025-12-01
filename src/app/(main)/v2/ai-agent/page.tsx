'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { SideNavigation } from '@/components/v2/SideNavigation'
import { TopNavigation } from '@/components/v2/TopNavigation'
import { SetUpAIAgentModal } from '@/components/v2/SetUpAIAgentModal'
import { typography } from '@/lib/typography/v2'
import { colorValues } from '@/lib/colors/v2'

const fontStyle = { fontFamily: typography.medium.fontFamily }
const fontMedium = typography.medium
const fontSemibold = typography.semibold

// Icon assets from local icon library
const imgAIAgentIllustration = '/icons/v2/AI agent illustration.svg'
const imgCheckIcon = '/icons/v2/check-icon.svg'
const imgLoadingIcon = '/icons/v2/loader-icon.svg'
const imgEditIcon = '/icons/v2/edit-icon.svg'
const imgPauseIcon = '/icons/v2/Pause icon.svg'
const imgPlayIcon = '/icons/v2/Play icon.svg'

interface ProcessItem {
  id: string
  label: string
  status: 'completed' | 'loading' | 'pending'
}

const defaultProcesses: ProcessItem[] = [
  { id: '1', label: 'Searching through LinkedIn', status: 'pending' },
  { id: '2', label: 'Found a job', status: 'pending' },
  { id: '3', label: 'Applying...', status: 'pending' },
  { id: '4', label: 'Analyzing job requirements', status: 'pending' },
  { id: '5', label: 'Optimizing resume', status: 'pending' },
  { id: '6', label: 'Generating cover letter', status: 'pending' },
  { id: '7', label: 'Submitting application', status: 'pending' },
]

export default function AIAgentPage() {
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false)
  const [isAgentActive, setIsAgentActive] = useState(false)
  const [isAgentPaused, setIsAgentPaused] = useState(false)
  const [processes, setProcesses] = useState<ProcessItem[]>(defaultProcesses)
  const [cycleOffset, setCycleOffset] = useState(0) // Track how many cycles we've completed
  const cycleOffsetRef = useRef(0) // Ref to track cycle offset without triggering re-renders
  const [isHoveringAgentButton, setIsHoveringAgentButton] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSuccessState, setShowSuccessState] = useState(false)

  const handleGetStarted = useCallback(() => {
    setIsSetupModalOpen(true)
  }, [])

  const handleSetupComplete = useCallback(() => {
    setIsSetupModalOpen(false)
    setIsAgentActive(true)
    // Reset processes when agent becomes active - start from first phase
    const initialProcesses: ProcessItem[] = defaultProcesses.map((p, index) => ({
      ...p,
      status: (index === 0 ? 'loading' : 'pending') as ProcessItem['status'],
    }))
    setProcesses(initialProcesses)
    setCycleOffset(0)
    cycleOffsetRef.current = 0
  }, [])

  const handlePauseResume = useCallback(() => {
    setIsAgentPaused(prev => !prev)
  }, [])

  // Infinite loop process animation
  useEffect(() => {
    if (!isAgentActive || isAgentPaused) {
      return
    }

    let timeoutId: NodeJS.Timeout
    let isActive = true

    const runStep = async () => {
      // 1. Loading Phase (3.5s)
      // The current process shows a spinner
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 3500)
      })
      if (!isActive) return

      // 2. Success Phase (1s)
      // The spinner turns into a checkmark
      setShowSuccessState(true)
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 1000)
      })
      if (!isActive) return

      // 3. Transition Phase (0.5s)
      // The items slide up
      setIsTransitioning(true)
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 500)
      })
      if (!isActive) return

      // 4. Update State & Reset
      // Instantly swap content and reset positions
      setProcesses(prev => {
        const currentLoadingIndex = prev.findIndex(p => p.status === 'loading')
        
        // Determine next index (looping)
        let nextIndex = 0
        if (currentLoadingIndex >= 0) {
          nextIndex = (currentLoadingIndex + 1) % prev.length
        }

        // Update cycle count if wrapping around
        if (nextIndex === 0) {
          setCycleOffset(c => c + 1)
          cycleOffsetRef.current += 1
        }

        const updated = [...prev]
        
        // Mark current as completed
        if (currentLoadingIndex >= 0) {
          updated[currentLoadingIndex] = { ...updated[currentLoadingIndex], status: 'completed' }
        }
        
        // Mark next as loading
        updated[nextIndex] = { ...updated[nextIndex], status: 'loading' }
        
        // If we just looped, reset previous completed items to pending so they can be "processed" again visually if needed,
        // or just keep them completed?
        // Request: "make the overall process a loop".
        // If we loop, the "completed" items from the previous cycle need to eventually reset to "pending" 
        // OR we just treat them as new pending items when they re-enter the window.
        // Simpler: When setting index X to loading, ensure it's "fresh".
        
        // To support infinite visual looping, we should probably reset the *next* item to 'pending' 
        // just before we process it? Or reset the whole list?
        // Let's Reset the status of the *next* item to 'pending' before making it 'loading' 
        // is redundant.
        // Actually, if we loop, we want the items to look "pending" before they slide in.
        // Let's reset the specific item we are about to process.
        // AND reset the item *after* it (so it looks pending in the "next" slot).
        
        const nextNextIndex = (nextIndex + 1) % prev.length
        updated[nextNextIndex] = { ...updated[nextNextIndex], status: 'pending' }

        return updated
      })

      setIsTransitioning(false)
      setShowSuccessState(false)

      // Loop again
      runStep()
    }

    runStep()

    return () => {
      isActive = false
      clearTimeout(timeoutId)
    }
  }, [isAgentActive, isAgentPaused])
  return (
    <div
      className="bg-v2-background-primary content-stretch flex flex-col gap-[40px] items-center relative w-full min-h-screen"
      style={fontStyle}
    >
      {/* Header */}
      <TopNavigation />

      {/* Main content */}
      <div className="basis-0 box-border content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px px-[80px] py-0 relative shrink-0 w-full">
        <div className="basis-0 content-stretch flex gap-[40px] grow items-start min-h-px min-w-px relative shrink-0 w-full">
          <SideNavigation className="box-border content-stretch flex flex-col gap-[17px] h-full items-start p-[24px] relative rounded-[16px] shrink-0 w-[280px]" />

          <div className="basis-0 box-border content-stretch flex flex-col gap-[24px] grow h-full items-start min-h-px min-w-px p-[24px] relative shrink-0">
            <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full">
              {/* Dashboard header container */}
              <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
                {/* Dashboard section */}
                <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                    <p
                      className="leading-[28px] not-italic relative shrink-0 text-[18px] text-v2-text-primary text-nowrap whitespace-pre"
                      style={fontSemibold}
                    >
                      AI application agent
                    </p>
                    <div
                      className="border border-solid box-border content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[40px] shrink-0"
                      style={{
                        backgroundColor: isAgentActive
                          ? colorValues.status.accepted.bg
                          : colorValues.status.offer.bg,
                        borderColor: isAgentActive
                          ? colorValues.status.accepted.border
                          : colorValues.status.offer.border,
                      }}
                    >
                      <p
                        className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre"
                        style={{
                          ...fontMedium,
                          color: isAgentActive
                            ? colorValues.status.accepted.text
                            : colorValues.status.offer.text,
                        }}
                      >
                        {isAgentActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <p
                    className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-secondary w-full"
                    style={fontMedium}
                  >
                    Automatically apply to listings 24/7. The agent analyzes job boards, optimizes
                    your resume using your knowledge base, and submits tailored applications to
                    maximize your interview rate.
                  </p>
                </div>

                {/* Right side actions */}
                <div className="content-stretch flex gap-[24px] items-start relative shrink-0">
                  {/* Credits remaining/available card */}
                  <div className="bg-v2-background-secondary box-border content-stretch flex gap-[20px] items-center p-[16px] relative rounded-[8px] shrink-0">
                    <div className="content-stretch flex flex-col items-start relative shrink-0">
                      <p
                        className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-nowrap text-v2-text-primary whitespace-pre"
                        style={fontMedium}
                      >
                        {isAgentActive ? 'Credits remaining' : 'Credits available'}
                      </p>
                      <div
                        className="content-stretch flex items-center not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre"
                        style={fontMedium}
                      >
                        <p
                          className="leading-[20px] relative shrink-0 tracking-[-0.14px]"
                          style={{ color: colorValues.success.primary }}
                        >
                          {isAgentActive ? '125' : '500'}
                        </p>
                        <p className="leading-[1.7] relative shrink-0 text-v2-text-secondary">/</p>
                        <p className="leading-[20px] relative shrink-0 text-v2-text-secondary">
                          500
                        </p>
                      </div>
                    </div>
                    {/* Circular Progress Indicator */}
                    <div className="relative shrink-0 size-[32px]">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        className="transform -rotate-90"
                        style={{ transform: 'rotate(-90deg)' }}
                      >
                        {/* Background circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          fill="none"
                          stroke={colorValues.background.primary}
                          strokeWidth="2"
                        />
                        {/* Progress arc */}
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          fill="none"
                          stroke={colorValues.success.primary}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 14}`}
                          strokeDashoffset={`${2 * Math.PI * 14 * (1 - (isAgentActive ? 125 : 500) / 500)}`}
                          style={{
                            transition: 'stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                            filter: 'drop-shadow(0 0 2px rgba(72, 186, 119, 0.5))',
                          }}
                        />
                      </svg>
                    </div>
                  </div>

                  {isAgentActive ? (
                    /* Agent running/paused button */
                    <button
                      onClick={handlePauseResume}
                      onMouseEnter={() => setIsHoveringAgentButton(true)}
                      onMouseLeave={() => setIsHoveringAgentButton(false)}
                      className="box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        backgroundColor: isAgentPaused
                          ? colorValues.success.primary
                          : isHoveringAgentButton
                            ? colorValues.background.secondary
                            : colorValues.status.accepted.bg,
                        border: isAgentPaused
                          ? 'none'
                          : isHoveringAgentButton
                            ? `1px solid ${colorValues.border.default}`
                            : 'none',
                        transition:
                          'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'background-color, border-color, transform',
                        width: '140px', // Fixed width to prevent jumpiness
                        minWidth: '140px',
                      }}
                    >
                      <div className="overflow-clip relative shrink-0 size-[20px]">
                        {isAgentPaused ? (
                          <img alt="" className="block max-w-none size-full" src={imgPlayIcon} />
                        ) : isHoveringAgentButton ? (
                          <img alt="" className="block max-w-none size-full" src={imgPauseIcon} />
                        ) : (
                          <img
                            alt=""
                            className="block max-w-none size-full"
                            src={imgLoadingIcon}
                            style={{
                              animation: 'spin 3s linear infinite',
                              transformOrigin: 'center center',
                              filter: isHoveringAgentButton
                                ? 'brightness(0) invert(1)'
                                : `brightness(0) saturate(100%) invert(67%) sepia(30%) saturate(1000%) hue-rotate(90deg) brightness(0.9)`,
                            }}
                          />
                        )}
                      </div>
                      <p
                        className="leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre"
                        style={{
                          ...fontMedium,
                          color: isAgentPaused
                            ? colorValues.text.primary
                            : isHoveringAgentButton
                              ? colorValues.text.primary
                              : colorValues.success.primary,
                        }}
                      >
                        {isAgentPaused
                          ? 'Resume agent'
                          : isHoveringAgentButton
                            ? 'Pause agent'
                            : 'Agent running'}
                      </p>
                    </button>
                  ) : (
                    /* Get started button */
                    <button
                      onClick={handleGetStarted}
                      className="bg-v2-brand-primary box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <p
                        className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                        style={fontMedium}
                      >
                        Get started
                      </p>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {isAgentActive ? (
              <>
                {/* Stats Cards */}
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                  {/* Jobs scanned */}
                  <div className="basis-0 bg-v2-background-secondary box-border content-stretch flex flex-col gap-[20px] grow items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shrink-0">
                    <p
                      className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary tracking-[-0.14px] w-full"
                      style={fontMedium}
                    >
                      Jobs scanned
                    </p>
                    <div
                      className="content-stretch flex flex-col items-start not-italic relative shrink-0 w-full"
                      style={fontMedium}
                    >
                      <p className="leading-[normal] relative shrink-0 text-[24px] text-v2-text-primary w-full">
                        12
                      </p>
                      <p className="leading-[1.7] relative shrink-0 text-[14px] text-v2-text-muted w-full">
                        Total scanned jobs
                      </p>
                    </div>
                  </div>

                  {/* Generated cover letter */}
                  <div className="basis-0 bg-v2-background-secondary box-border content-stretch flex flex-col gap-[20px] grow items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shrink-0">
                    <p
                      className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary tracking-[-0.14px] w-full"
                      style={fontMedium}
                    >
                      Generated cover letter
                    </p>
                    <div
                      className="content-stretch flex flex-col items-start not-italic relative shrink-0 w-full"
                      style={fontMedium}
                    >
                      <p className="leading-[normal] relative shrink-0 text-[24px] text-v2-text-primary w-full">
                        0
                      </p>
                      <p className="leading-[1.7] relative shrink-0 text-[14px] text-v2-text-muted w-full">
                        Total generated letters
                      </p>
                    </div>
                  </div>

                  {/* Sent */}
                  <div className="basis-0 bg-v2-background-secondary box-border content-stretch flex flex-col gap-[20px] grow items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shrink-0">
                    <p
                      className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary tracking-[-0.14px] w-full"
                      style={fontMedium}
                    >
                      Sent
                    </p>
                    <div
                      className="content-stretch flex flex-col items-start not-italic relative shrink-0 w-full"
                      style={fontMedium}
                    >
                      <p className="leading-[normal] relative shrink-0 text-[24px] text-v2-text-primary w-full">
                        0
                      </p>
                      <p className="leading-[1.7] relative shrink-0 text-[14px] text-v2-text-muted w-full">
                        Applications sent
                      </p>
                    </div>
                  </div>

                  {/* Average match score */}
                  <div className="basis-0 bg-v2-background-secondary box-border content-stretch flex flex-col gap-[20px] grow items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shrink-0">
                    <p
                      className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary tracking-[-0.14px] w-full"
                      style={fontMedium}
                    >
                      Average match score
                    </p>
                    <div
                      className="content-stretch flex flex-col items-start not-italic relative shrink-0 w-full"
                      style={fontMedium}
                    >
                      <p className="leading-[normal] relative shrink-0 text-[24px] text-v2-text-primary w-full">
                        0
                      </p>
                      <p className="leading-[1.7] relative shrink-0 text-[14px] text-v2-text-muted w-full">
                        Average ATS score
                      </p>
                    </div>
                  </div>
                </div>

                {/* Active Banner */}
                <div className="bg-[#112531] box-border content-stretch flex flex-col gap-[4px] items-start p-[24px] relative rounded-[8px] shrink-0 w-full">
                  <p
                    className="leading-[28px] not-italic relative shrink-0 text-[18px] text-nowrap text-v2-text-primary whitespace-pre"
                    style={fontSemibold}
                  >
                    Your AI agent is now active!
                  </p>
                  <p
                    className="leading-[1.7] min-w-full not-italic relative shrink-0 text-[14px] text-v2-text-secondary w-full"
                    style={fontMedium}
                  >
                    Your agent is scanning job boards right now. You'll start seeing results within
                    the next few minutes. We'll notify you when applications are generated and sent.
                  </p>
                  <div className="content-stretch flex gap-[8px] items-start justify-end relative shrink-0 w-full">
                    <button className="bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]">
                      <p
                        className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                        style={fontMedium}
                      >
                        View all applications
                      </p>
                    </button>
                    <button className="bg-v2-brand-primary box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]">
                      <div className="relative shrink-0 size-[20px]">
                        <img alt="" className="block max-w-none size-full" src={imgEditIcon} />
                      </div>
                      <p
                        className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                        style={fontMedium}
                      >
                        Adjust preference
                      </p>
                    </button>
                  </div>
                </div>

                {/* Process List Container - Fixed frame: 120px height with 40px shadows top/bottom, 40px clear middle */}
                <div
                  className="relative shrink-0 w-[368px] overflow-hidden mt-[24px]"
                  style={{
                    height: '120px', // Fixed height: 40px top shadow + 40px middle clear + 40px bottom shadow
                  }}
                >
                  {(() => {
                    const loadingIndex = processes.findIndex(p => p.status === 'loading')
                    
                    // Identify the 3 items to show: Top (previous), Middle (current), Bottom (next)
                    let topItem: ProcessItem | null = null
                    let middleItem: ProcessItem | null = null
                    let bottomItem: ProcessItem | null = null

                    if (loadingIndex >= 0) {
                      // Middle is the current loading process
                      middleItem = processes[loadingIndex]
                      
                      // Top is the previous process (if any)
                      if (loadingIndex > 0) {
                        topItem = processes[loadingIndex - 1]
                      } else if (cycleOffset > 0) {
                        // If first item is loading but we have completed cycles, show last item of previous cycle
                        topItem = { ...processes[processes.length - 1], status: 'completed', id: `${processes[processes.length - 1].id}-prev` }
                      }
                      
                      // Bottom is the next process (if any)
                      if (loadingIndex < processes.length - 1) {
                        bottomItem = processes[loadingIndex + 1]
                      } else {
                        // If last item is loading, show first item of next cycle
                        bottomItem = { ...processes[0], status: 'pending', id: `${processes[0].id}-next` }
                      }
                    } else {
                      // No loading process - check if all completed
                      const allCompleted = processes.every(p => p.status === 'completed')
                      
                      if (allCompleted) {
                        // All completed - show last item as middle
                        middleItem = processes[processes.length - 1]
                        topItem = processes[processes.length - 2]
                        // Next cycle first item
                        bottomItem = { ...processes[0], status: 'pending', id: `${processes[0].id}-next` }
                      } else {
                         // Initial state or fallback - show first item as middle (loading/pending)
                         middleItem = processes[0]
                         bottomItem = processes[1]
                      }
                    }

                    const visibleItems = [
                      { item: topItem, top: 0 },
                      { item: middleItem, top: 48 },
                      { item: bottomItem, top: 96 }
                    ]

                    return (
                      <>
                        {/* Process List - Fixed positioning for 3 items */}
                        <div className="absolute w-[368px] h-full left-0 top-0">
                          {visibleItems.map(({ item, top }, index) => {
                            if (!item) return null
                            
                            // Determine state for this specific item instance
                            const isMiddleItem = index === 1 // Middle slot
                            const isCompleted = item.status === 'completed'
                            
                            // Special logic for the middle item (currently active process)
                            // If in success state, force it to look completed (check icon)
                            // Otherwise, if it's loading, it shows the spinner
                            // If transitioning, we maintain the state until the snap
                            
                            // During transition, we shift everything up by 48px
                            const translateY = isTransitioning ? -48 : 0
                            const transitionStyle = isTransitioning 
                              ? 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)' 
                              : 'none' // Instant reset when not transitioning

                            return (
                              <div
                                key={`${item.id}-${index}`}
                                className="absolute flex gap-[4px] items-center w-full"
                                style={{
                                  top: `${top}px`,
                                  left: 0,
                                  height: '24px',
                                  transform: `translateY(${translateY}px)`,
                                  transition: transitionStyle,
                                }}
                              >
                                <div className="overflow-clip relative shrink-0 size-[16px]">
                                  {isCompleted || (isMiddleItem && showSuccessState) ? (
                                    // Completed or Success Phase: Show check icon (16px, green #008000)
                                    <img
                                      alt=""
                                      className="block max-w-none size-full"
                                      src={imgCheckIcon}
                                      style={{
                                        transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                      }}
                                    />
                                  ) : (
                                    // Loading or Pending: Show loading icon (16px, yellow #ddd2a3)
                                    <img
                                      alt=""
                                      className="block max-w-none size-full"
                                      src={imgLoadingIcon}
                                      style={{
                                        animation: item.status === 'loading' ? 'spin 1s linear infinite' : 'none',
                                        transformOrigin: 'center center',
                                        transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                      }}
                                    />
                                  )}
                                </div>
                                <p
                                  className="leading-[1.7] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre"
                                  style={fontMedium}
                                >
                                  {item.label}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                        {/* Top shadow - 40px height, fades the first item (above, in shadow) */}
                        <div
                          className="absolute pointer-events-none z-20"
                          style={{
                            left: '0',
                            top: '0',
                            width: '368px',
                            height: '40px', // Top shadow height
                            background: `linear-gradient(to bottom, ${colorValues.background.primary} 0%, ${colorValues.background.primary}CC 50%, ${colorValues.background.primary}00 100%)`,
                          }}
                        />
                        {/* Bottom shadow - 40px height, fades the third item (below, in shadow) */}
                        <div
                          className="absolute pointer-events-none z-20"
                          style={{
                            left: '0',
                            top: '80px', // Starts at 80px (40px top shadow + 40px middle clear)
                            width: '368px',
                            height: '40px', // Bottom shadow height
                            background: `linear-gradient(to bottom, ${colorValues.background.primary}00 0%, ${colorValues.background.primary}CC 50%, ${colorValues.background.primary} 100%)`,
                          }}
                        />
                      </>
                    )
                  })()}
                </div>
              </>
            ) : (
              /* Illustration area - shown when inactive */
              <div
                className="content-stretch flex flex-col gap-[10px] items-start relative rounded-[8px] shrink-0 w-full"
                style={{ backgroundColor: colorValues.background.card }}
              >
                <div className="h-[550px] relative shrink-0 w-full flex items-center justify-center">
                  <img
                    alt="AI Agent Illustration"
                    className="block max-w-none h-full w-auto"
                    src={imgAIAgentIllustration}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Set up AI Agent Modal */}
      <SetUpAIAgentModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onComplete={handleSetupComplete}
      />
    </div>
  )
}
