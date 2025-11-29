'use client'

import { typography } from '@/lib/typography/v2'

const fontMedium = typography.medium

interface AddAnotherQuestionButtonProps {
  onClick: () => void
}

export function AddAnotherQuestionButton({ onClick }: AddAnotherQuestionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-v2-background-primary box-border content-stretch flex gap-[4px] items-center justify-center px-0 py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99]"
      style={{ willChange: 'transform' }}
    >
      <div className="relative shrink-0 size-[20px]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block max-w-none size-full"
        >
          <path
            d="M5 10H15"
            stroke="#ffffff"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 15V5"
            stroke="#ffffff"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p
        className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-button text-nowrap whitespace-pre"
        style={fontMedium}
      >
        Add another question
      </p>
    </button>
  )
}
