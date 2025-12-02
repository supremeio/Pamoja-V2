/**
 * Application constants
 */

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
} as const

// Toast defaults
export const TOAST = {
  DEFAULT_DURATION: 5000,
  POSITION: {
    TOP: 80,
    RIGHT: 40
  }
} as const

// Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  DEFAULT_PAGE: 1
} as const

// Routes
export const ROUTES = {
  DASHBOARD: '/v2/dashboard',
  APPLICATIONS: '/v2/applications',
  TOOLKIT: '/v2/toolkit',
  RESULT: '/v2/result'
} as const

// Animation durations
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
} as const

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 50,
  MODAL: 100,
  TOAST: 200,
  TOOLTIP: 300
} as const



