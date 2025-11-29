/**
 * Shared type definitions for Pamoja V2
 */

// Application types
export interface Application {
  id: string
  company: string
  role: string
  dateApplied: string
  atsScore?: string
  status: ApplicationStatus
  notes?: string
}

export type ApplicationStatus = 'applied' | 'interview' | 'rejected' | 'offer' | 'accepted'

// Question types
export interface Question {
  id: string
  question: string
  answer: string
  hasAnswer: boolean
}

// Document types
export interface Document {
  id: string
  fileName: string
  uploadState?: 'uploading' | 'uploaded' | 'error'
  uploadProgress?: number
}

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastData {
  id: string
  type: ToastType
  message: string
  duration?: number
  position?: {
    top?: number
    right?: number
  }
}

// Form types
export interface ApplicationFormData {
  company: string
  role: string
  dateApplied: string
  atsScore: string
  status: ApplicationStatus
}

export interface QuestionFormData {
  question: string
  answer: string
}

// Modal types
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T
  error?: {
    code: string
    message: string
  }
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

