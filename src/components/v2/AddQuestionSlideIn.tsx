'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { typography } from '@/lib/typography/v2'
import { TextField } from './TextField'
import { QuestionRow } from './QuestionRow'
import { AddAnotherQuestionButton } from './AddAnotherQuestionButton'

const fontMedium = typography.medium
const fontSemibold = typography.semibold

// Icon assets from local icon library
const imgCloseIcon = "/icons/v2/close-icon.svg"

interface QuestionForm {
  id: string
  question: string
  answer: string
  isFilled: boolean // Track if question has been filled (has question text)
  error?: string // Error message for validation
}

interface AddQuestionSlideInProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (questions: Array<{ question: string; answer: string }>) => void
}

export function AddQuestionSlideIn({
  isOpen,
  onClose,
  onSubmit
}: AddQuestionSlideInProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { id: `q-${Date.now()}`, question: '', answer: '', isFilled: false, error: undefined }
  ])
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const questionRowRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      setIsAnimating(false)
      // Reset form when slide-in opens
      setQuestions([{ id: `q-${Date.now()}`, question: '', answer: '', isFilled: false, error: undefined }])
      setExpandedQuestionId(null)
      setEditingQuestionId(null)
      // Use requestAnimationFrame for smoother animation
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

  // Collapse expanded questions when clicking outside
  useEffect(() => {
    if (!isOpen || !expandedQuestionId) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // Don't collapse if clicking on buttons, inputs, or textareas
      if (target.closest('button') || target.closest('input') || target.closest('textarea')) {
        return
      }

      // Check if click is outside all QuestionRow containers
      let clickedInsideQuestionRow = false
      questionRowRefs.current.forEach((ref) => {
        if (ref && ref.contains(target)) {
          clickedInsideQuestionRow = true
        }
      })

      // If click is outside and not editing, collapse
      if (!clickedInsideQuestionRow && editingQuestionId !== expandedQuestionId) {
        setExpandedQuestionId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, expandedQuestionId, editingQuestionId])

  // All hooks must be called before any early returns
  const overlayStyle: React.CSSProperties = { 
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    opacity: isAnimating ? 1 : 0,
    transition: isMounted ? 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
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

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  const handleAddQuestion = useCallback(() => {
    setQuestions(prev => {
      // Get current form questions (unfilled ones)
      const currentFormQuestions = prev.filter(q => !q.isFilled)
      
      // Validate current form questions - show error if question is empty
      const validated = prev.map(q => {
        if (!q.isFilled && q.question.trim().length === 0) {
          // Show error for empty question
          return { ...q, error: 'Question is required' }
        }
        // Clear error if question has text
        return { ...q, error: undefined }
      })
      
      // Check if there are any errors in current form questions
      const hasErrors = validated.some(q => !q.isFilled && q.error)
      
      // Only add new question if there are no errors
      if (!hasErrors) {
        // Mark all current form questions with non-empty question text as filled
        const updated = validated.map(q => {
          if (!q.isFilled && q.question.trim().length > 0) {
            return { ...q, isFilled: true }
          }
          return q
        })
        // Add new empty question
        return [...updated, { id: `q-${Date.now()}`, question: '', answer: '', isFilled: false, error: undefined }]
      }
      
      return validated
    })
  }, [])

  const handleQuestionChange = useCallback((id: string, value: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        // Clear error when user types, but don't mark as filled yet
        return { 
          ...q, 
          question: value,
          error: undefined // Clear error when user starts typing
        }
      }
      return q
    }))
  }, [])

  const handleAnswerChange = useCallback((id: string, value: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, answer: value } : q))
  }, [])

  const handleSubmit = useCallback(() => {
    // Separate filled and unfilled questions
    const filledQuestions = questions.filter(q => q.isFilled)
    const unfilledQuestions = questions.filter(q => !q.isFilled)
    
    // If there are filled questions and all unfilled questions are empty, just save the filled ones
    if (filledQuestions.length > 0 && unfilledQuestions.every(q => q.question.trim().length === 0)) {
      const validQuestions = filledQuestions.map(q => ({ 
        question: q.question.trim(), 
        answer: q.answer.trim() 
      }))
      
      if (validQuestions.length > 0) {
        onSubmit(validQuestions)
        setQuestions([{ id: `q-${Date.now()}`, question: '', answer: '', isFilled: false, error: undefined }])
        onClose()
      }
      return
    }
    
    // Otherwise, validate all unfilled questions
    const validated = questions.map(q => {
      if (!q.isFilled && q.question.trim().length === 0) {
        return { ...q, error: 'Question is required' }
      }
      return { ...q, error: undefined }
    })
    
    // Check if there are any errors
    const hasErrors = validated.some(q => q.error)
    
    if (hasErrors) {
      // Update state with errors
      setQuestions(validated)
      return
    }
    
    // Get all questions with non-empty question text (both filled and unfilled)
    const validQuestions = validated
      .filter(q => q.question.trim().length > 0)
      .map(q => ({ question: q.question.trim(), answer: q.answer.trim() }))
    
    if (validQuestions.length > 0) {
      onSubmit(validQuestions)
      setQuestions([{ id: `q-${Date.now()}`, question: '', answer: '', isFilled: false, error: undefined }])
      onClose()
    }
  }, [questions, onSubmit, onClose])

  const handleCancel = useCallback(() => {
    setQuestions([{ id: `q-${Date.now()}`, question: '', answer: '', isFilled: false, error: undefined }])
    setExpandedQuestionId(null)
    setEditingQuestionId(null)
    onClose()
  }, [onClose])

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedQuestionId(prev => prev === id ? null : id)
    // Close editing when expanding/collapsing
    if (editingQuestionId === id) {
      setEditingQuestionId(null)
    }
  }, [editingQuestionId])

  const handleEdit = useCallback((id: string) => {
    setEditingQuestionId(id)
    // Expand the question when editing
    setExpandedQuestionId(id)
  }, [])

  const handleSave = useCallback((id: string, newAnswer: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, answer: newAnswer } : q
    ))
    setEditingQuestionId(null)
    // Keep expanded to show the saved answer
  }, [])

  const handleDelete = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
    // Clear expanded/editing state if the deleted question was expanded/editing
    if (expandedQuestionId === id) {
      setExpandedQuestionId(null)
    }
    if (editingQuestionId === id) {
      setEditingQuestionId(null)
    }
  }, [expandedQuestionId, editingQuestionId])

  const handleCopy = useCallback((id: string) => {
    const question = questions.find(q => q.id === id)
    if (question?.answer) {
      navigator.clipboard.writeText(question.answer)
    }
  }, [questions])

  // Separate filled questions from the current form
  const filledQuestions = useMemo(() => questions.filter(q => q.isFilled), [questions])
  const currentFormQuestions = useMemo(() => questions.filter(q => !q.isFilled), [questions])

  // Calculate if submit button should be enabled
  const hasValidQuestions = useMemo(() => {
    return questions.some(q => q.question.trim().length > 0)
  }, [questions])

  // Calculate the number of valid questions for button text
  const validQuestionCount = useMemo(() => {
    return questions.filter(q => q.question.trim().length > 0).length
  }, [questions])

  // Get button text based on question count
  const buttonText = useMemo(() => {
    if (validQuestionCount === 0) {
      return 'Add question'
    } else if (validQuestionCount === 1) {
      return 'Add question'
    } else {
      return `Add ${validQuestionCount} questions`
    }
  }, [validQuestionCount])

  // Early return after all hooks
  if (!isMounted) {
    return null
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-50"
        style={overlayStyle}
        onClick={handleOverlayClick}
      />
      <div 
        className="fixed bg-v2-background-primary border border-v2-border border-solid box-border flex flex-col right-0 top-[24px] bottom-[24px] rounded-[12px] w-[480px] z-50"
        style={modalLeftStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section - Matching Figma design */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full p-[16px] pb-[16px]">
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
            <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px not-italic relative shrink-0">
              <p className="leading-[28px] relative shrink-0 text-[18px] text-v2-text-primary w-full" style={fontSemibold}>
                Add a question
              </p>
              <p className="leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-v2-text-secondary w-full" style={fontMedium}>
                Add multiple questions to your toolkit
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="overflow-clip relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200 ease-out"
              style={{ willChange: 'transform, opacity' }}
              aria-label="Close modal"
            >
              <img alt="" className="block max-w-none size-full" src={imgCloseIcon} />
            </button>
          </div>
        </div>

        {/* Content Section - Matching Figma design exactly */}
        <div className="v2-scrollbar flex-1 overflow-y-auto px-[16px] min-h-0" style={{ scrollBehavior: 'smooth' }}>
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full pt-[16px] pb-[16px]" style={{ transition: 'all 200ms ease-out' }}>
            {/* Show filled questions as QuestionRow components with full functionality */}
            {filledQuestions.map((q, index) => (
              <div
                key={q.id}
                className="w-full"
                style={{ 
                  animation: 'fadeInUp 200ms ease-out',
                  transition: 'opacity 200ms ease-out, transform 200ms ease-out'
                }}
                ref={(el) => {
                  if (el) {
                    questionRowRefs.current.set(q.id, el)
                  } else {
                    questionRowRefs.current.delete(q.id)
                  }
                }}
              >
                <QuestionRow
                  id={q.id}
                  question={q.question}
                  answer={q.answer}
                  hasAnswer={q.answer.trim().length > 0}
                  isExpanded={expandedQuestionId === q.id}
                  isEditing={editingQuestionId === q.id}
                  onToggleExpand={handleToggleExpand}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCopy={handleCopy}
                  showDivider={index < filledQuestions.length - 1 || currentFormQuestions.length > 0}
                />
              </div>
            ))}

            {/* Form fields container - Matching Figma structure exactly */}
            {currentFormQuestions.length > 0 && (
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" style={{ animation: 'fadeInUp 200ms ease-out' }}>
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                    {currentFormQuestions.map((q, index) => (
                      <div key={q.id} className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" style={{ transition: 'opacity 200ms ease-out, transform 200ms ease-out' }}>
                        <TextField
                          label="Question"
                          placeholder="E.g, How do you handle pressure?"
                          value={q.question}
                          onChange={(value) => handleQuestionChange(q.id, value)}
                          width="100%"
                          showIcon={false}
                          type="text"
                          error={q.error}
                        />
                        <TextField
                          label="Answer"
                          placeholder="Pressure? What pressure"
                          value={q.answer}
                          onChange={(value) => handleAnswerChange(q.id, value)}
                          width="100%"
                          showIcon={false}
                          type="textarea"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Add Another Question Button - Matching Figma */}
                <AddAnotherQuestionButton onClick={handleAddQuestion} />
              </div>
            )}
          </div>
        </div>

        {/* Footer - Matching Figma design */}
        <div className="content-stretch flex gap-[8px] items-start justify-end relative shrink-0 p-[16px] pt-[16px]">
          <button
            onClick={handleCancel}
            className="bg-v2-background-secondary border border-v2-border border-solid box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-[120px] cursor-pointer transition-all duration-200 ease-out hover:bg-v2-background-primary hover:border-v2-border-light hover:scale-[1.02] active:scale-[0.98] active:opacity-90"
            style={{ willChange: 'background-color, border-color, transform, opacity' }}
          >
            <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              Cancel
            </p>
          </button>
          <button
            onClick={handleSubmit}
            disabled={!hasValidQuestions}
            className="bg-v2-brand-primary box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] active:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ willChange: 'opacity, transform' }}
          >
            <div className="relative shrink-0 size-[20px]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="block max-w-none size-full">
                <path d="M5 10H15" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 15V5" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              {buttonText}
            </p>
          </button>
        </div>
      </div>
    </>
  )
}
