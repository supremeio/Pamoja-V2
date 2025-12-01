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
  const [totalProcessesCompleted, setTotalProcessesCompleted] = useState(0) // Track total processes completed across all cycles
  const processIntervalRef = useRef<NodeJS.Timeout>()
  const cycleOffsetRef = useRef(0) // Ref to track cycle offset without triggering re-renders
  const totalProcessesCompletedRef = useRef(0) // Ref to track total processes without triggering re-renders
  const [isHoveringAgentButton, setIsHoveringAgentButton] = useState(false)

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
    setTotalProcessesCompleted(0)
    cycleOffsetRef.current = 0
    totalProcessesCompletedRef.current = 0
  }, [])

  const handlePauseResume = useCallback(() => {
    setIsAgentPaused(prev => !prev)
  }, [])

  // Auto-progress through processes for 3 cycles (21 processes total)
  useEffect(() => {
    if (!isAgentActive || isAgentPaused) {
      if (processIntervalRef.current) {
        clearInterval(processIntervalRef.current)
        processIntervalRef.current = undefined
      }
      return
    }

    const maxCycles = 3
    const processCount = defaultProcesses.length
    const maxProcesses = maxCycles * processCount // 3 cycles * 7 processes = 21

    const progressProcesses = () => {
      setProcesses(prev => {
        const currentLoadingIndex = prev.findIndex(p => p.status === 'loading')
        const allCompleted = prev.every(p => p.status === 'completed')

        // Use refs to get current values without causing re-renders
        const currentTotalCompleted = totalProcessesCompletedRef.current
        const currentCycleOffset = cycleOffsetRef.current

        // If we've completed 3 cycles (21 processes), stop
        if (currentTotalCompleted >= maxProcesses) {
          if (processIntervalRef.current) {
            clearInterval(processIntervalRef.current)
            processIntervalRef.current = undefined
          }
          return prev
        }

        // If all processes are completed in current cycle
        if (allCompleted) {
          const newCycleOffset = currentCycleOffset + 1

          // If we've completed 3 cycles, stop (don't start new cycle)
          if (newCycleOffset >= maxCycles) {
            if (processIntervalRef.current) {
              clearInterval(processIntervalRef.current)
              processIntervalRef.current = undefined
            }
            return prev
          }

          // Update cycle offset and total (all 7 processes in this cycle are completed)
          cycleOffsetRef.current = newCycleOffset
          const newTotalCompleted = newCycleOffset * prev.length
          totalProcessesCompletedRef.current = newTotalCompleted
          setCycleOffset(newCycleOffset)
          setTotalProcessesCompleted(newTotalCompleted)

          // Start next cycle
          const reset: ProcessItem[] = prev.map((p, index) => ({
            ...p,
            status: (index === 0 ? 'loading' : 'pending') as ProcessItem['status'],
          }))
          return reset
        }

        if (currentLoadingIndex < 0) {
          // No loading process, start the first pending one
          const firstPendingIndex = prev.findIndex(p => p.status === 'pending')
          if (firstPendingIndex >= 0) {
            const updated = [...prev]
            updated[firstPendingIndex] = { ...updated[firstPendingIndex], status: 'loading' }
            return updated
          }
          return prev
        }

        // Mark current loading as completed and start next pending
        const updated = [...prev]
        updated[currentLoadingIndex] = { ...updated[currentLoadingIndex], status: 'completed' }

        // Calculate new total before updating state
        const newTotalCompleted = currentTotalCompleted + 1
        totalProcessesCompletedRef.current = newTotalCompleted

        // Stop if we've reached max processes
        if (newTotalCompleted >= maxProcesses) {
          if (processIntervalRef.current) {
            clearInterval(processIntervalRef.current)
            processIntervalRef.current = undefined
          }
        } else {
          // Update total processes completed
          setTotalProcessesCompleted(newTotalCompleted)
        }

        const nextPendingIndex = updated.findIndex(p => p.status === 'pending')
        if (nextPendingIndex >= 0) {
          updated[nextPendingIndex] = { ...updated[nextPendingIndex], status: 'loading' }
        }

        return updated
      })
    }

    // Progress every 4 seconds - only create interval once when agent becomes active
    processIntervalRef.current = setInterval(progressProcesses, 4000)

    return () => {
      if (processIntervalRef.current) {
        clearInterval(processIntervalRef.current)
        processIntervalRef.current = undefined
      }
    }
  }, [isAgentActive, isAgentPaused]) // Only depend on active/paused state, not on cycleOffset or totalProcessesCompleted
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
                    const itemSpacing = 48 // Spacing from one item top to next item top (positions: 0px, 48px, 96px)

                    // Calculate which processes to show and the offset
                    // The loading process should always be at position 48px (middle clear area)
                    // We need to show: [completed before] [loading] [pending after]
                    
                    let startIndex = 0
                    let listTopOffset = 0

                    if (loadingIndex >= 0) {
                      // We have a loading process - center it at position 48px
                      // Show one before (if exists), loading, one after (if exists)
                      startIndex = Math.max(0, loadingIndex - 1)
                      
                      // Ensure we have 3 items to show
                      if (startIndex + 3 > processes.length) {
                        startIndex = Math.max(0, processes.length - 3)
                      }
                      
                      // The loading process should be at position 48px (middle clear area) in the visible container
                      // The loading process is at position `loadingIndex * itemSpacing` in the list (0px, 48px, 96px, etc.)
                      // We want it to appear at 48px in the visible container
                      // So: listTopOffset = 48px - (loadingIndex * itemSpacing)
                      
                      // Account for completed cycles - each cycle moves us up by processes.length * itemSpacing
                      const cyclesOffset = cycleOffset * processes.length * itemSpacing
                      
                      // Simple calculation: position the loading process at 48px
                      listTopOffset = 48 - (loadingIndex * itemSpacing) - cyclesOffset
                    } else {
                      // No loading process - check if all completed
                      const allCompleted = processes.every(p => p.status === 'completed')
                      if (allCompleted) {
                        // Show last 2 processes with last in middle
                        startIndex = processes.length - 2
                        // All processes in current cycle are completed
                        const totalCompleted = (cycleOffset + 1) * processes.length
                        // Center the last process at 48px
                        const lastProcessIndex = processes.length - 1
                        const lastPositionInVisible = lastProcessIndex - startIndex
                        const offsetToCenter = (1 - lastPositionInVisible) * itemSpacing
                        listTopOffset = -totalCompleted * itemSpacing + offsetToCenter
                      } else {
                        // No loading and not all completed - shouldn't happen when active
                        startIndex = 0
                        listTopOffset = 0
                      }
                    }

                    const visibleProcesses = processes.slice(startIndex, startIndex + 3)

                    // If we're at the end and need to show the next cycle's first item, add it
                    if (startIndex + 3 > processes.length && cycleOffset > 0) {
                      // We're showing the last processes, add first process of next cycle at the end
                      const nextCycleFirst = processes[0]
                      visibleProcesses.push({
                        ...nextCycleFirst,
                        id: `${nextCycleFirst.id}-next-cycle`,
                      })
                    }

                    return (
                      <>
                        {/* Process List - positioned absolutely to center the loading item */}
                        <div
                          className="absolute content-stretch flex flex-col gap-[24px] items-start w-[368px]"
                          style={{
                            left: '0',
                            top: `${listTopOffset}px`,
                          }}
                        >
                          {visibleProcesses.map(process => {
                            const isCompleted = process.status === 'completed'
                            const isLoading = process.status === 'loading'

                            return (
                              <div
                                key={`${process.id}-${process.status}-${cycleOffset}`}
                                className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full"
                                style={{
                                  opacity: 1,
                                  transform: 'translateY(0)',
                                  transition:
                                    'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                              >
                                <div className="overflow-clip relative shrink-0 size-[16px]">
                                  {isCompleted ? (
                                    // Completed: Show check icon (16px, green #008000)
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
                                        animation: isLoading ? 'spin 1s linear infinite' : 'none',
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
                                  {process.label}
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
