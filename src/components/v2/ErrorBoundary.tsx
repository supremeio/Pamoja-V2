'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { typography } from '@/lib/typography/v2'
import { colorValues } from '@/lib/colors/v2'

const fontMedium = typography.medium
const fontSemibold = typography.semibold

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary component for catching and handling React errors
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Error caught by boundary:', error, errorInfo)
      // TODO: Send to error reporting service (e.g., Sentry)
    } else {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          className="flex flex-col items-center justify-center min-h-screen p-8"
          style={{
            backgroundColor: colorValues.background.primary,
            color: colorValues.text.primary
          }}
        >
          <div
            className="flex flex-col gap-4 items-center max-w-md w-full p-8 rounded-lg"
            style={{
              backgroundColor: colorValues.background.secondary,
              border: `1px solid ${colorValues.border.default}`
            }}
          >
            <h2
              className="text-xl"
              style={fontSemibold}
            >
              Something went wrong
            </h2>
            <p
              className="text-sm text-center"
              style={{
                ...fontMedium,
                color: colorValues.text.secondary
              }}
            >
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded transition-colors"
              style={{
                ...fontMedium,
                backgroundColor: colorValues.brand.primary,
                color: colorValues.text.primary
              }}
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

