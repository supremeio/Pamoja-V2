'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { typography } from '@/lib/typography/v2'
import { TextField } from './TextField'

const fontMedium = typography.medium
const fontSemibold = typography.semibold

interface AddQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (question: string, answer: string) => void
}

export function AddQuestionModal({
  isOpen,
  onClose,
  onSubmit
}: AddQuestionModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure smooth mount animation
      const timer = setTimeout(() => {
        setIsMounted(true)
      }, 10)
      // Reset form when modal opens
      setQuestion('')
      setAnswer('')
      return () => clearTimeout(timer)
    } else {
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

  // All hooks must be called before any early returns
  const overlayStyle = useMemo<React.CSSProperties>(() => ({
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    opacity: isOpen && isMounted ? 1 : 0,
    transition: isMounted ? 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
    pointerEvents: (isOpen && isMounted ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isMounted ? 'visible' : 'hidden') as React.CSSProperties['visibility']
  }), [isOpen, isMounted])

  const modalStyle = useMemo<React.CSSProperties>(() => ({
    opacity: isOpen && isMounted ? 1 : 0,
    transform: isOpen && isMounted ? 'translate(-50%, 0)' : 'translate(-50%, -10px)',
    transition: isMounted ? 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
    pointerEvents: (isOpen && isMounted ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    visibility: (isMounted ? 'visible' : 'hidden') as React.CSSProperties['visibility']
  }), [isOpen, isMounted])

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  const handleSubmit = useCallback(() => {
    const trimmedQuestion = question.trim()
    if (trimmedQuestion.length > 0) {
      onSubmit(trimmedQuestion, answer.trim())
      setQuestion('')
      setAnswer('')
      onClose()
    }
  }, [question, answer, onSubmit, onClose])

  const handleCancel = useCallback(() => {
    setQuestion('')
    setAnswer('')
    onClose()
  }, [onClose])

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
        className="fixed bg-v2-background-primary border border-v2-border border-solid box-border content-stretch flex flex-col gap-[20px] items-start left-1/2 p-[24px] rounded-[12px] top-[160px] w-[420px] z-50"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
          <p className="leading-[28px] relative shrink-0 text-[18px] text-v2-text-primary w-full" style={fontSemibold}>
            Add question
          </p>
          <p className="leading-[1.7] relative shrink-0 text-[14px] text-v2-text-secondary w-full" style={fontMedium}>
            Add a new question to your toolkit
          </p>
        </div>
        
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <TextField
            label="Question"
            placeholder="Enter your question"
            value={question}
            onChange={(value) => setQuestion(value)}
            width="100%"
            showIcon={false}
            type="text"
          />
          <TextField
            label="Answer"
            placeholder="Enter your answer"
            value={answer}
            onChange={(value) => setAnswer(value)}
            width="100%"
            showIcon={false}
            type="textarea"
          />
        </div>

        <div className="content-stretch flex gap-[16px] items-start justify-end relative shrink-0 w-full">
          <button
            onClick={handleCancel}
            className="basis-0 bg-v2-background-primary border border-v2-border border-solid box-border content-stretch flex gap-[4px] grow items-center justify-center min-h-px min-w-px px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              Cancel
            </p>
          </button>
          <button
            onClick={handleSubmit}
            disabled={question.trim().length === 0}
            className="basis-0 bg-v2-brand-primary box-border content-stretch flex gap-[4px] grow items-center justify-center min-h-px min-w-px px-[16px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
              Add question
            </p>
          </button>
        </div>
      </div>
    </>
  )
}

