import React from 'react'
import { colorValues } from '@/lib/colors/v2'
import type { ApplicationStatus } from '@/types'

export const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    applied: 'Applied',
    interview: 'Interview',
    rejected: 'Rejected',
    offer: 'Offer',
    accepted: 'Accepted'
  }
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
}

export const getStatusStyles = (status: string): React.CSSProperties => {
  const statusStyles: Record<string, React.CSSProperties> = {
    applied: {
      backgroundColor: colorValues.status.applied.bg,
      borderColor: colorValues.status.applied.border,
      color: colorValues.status.applied.text
    },
    rejected: {
      backgroundColor: colorValues.status.rejected.bg,
      borderColor: colorValues.status.rejected.border,
      color: colorValues.status.rejected.text
    },
    interview: {
      backgroundColor: colorValues.status.interview.bg,
      borderColor: colorValues.status.interview.border,
      color: colorValues.status.interview.text
    },
    offer: {
      backgroundColor: colorValues.status.offer.bg,
      borderColor: colorValues.status.offer.border,
      color: colorValues.status.offer.text
    },
    accepted: {
      backgroundColor: colorValues.status.accepted.bg,
      borderColor: colorValues.status.accepted.border,
      color: colorValues.status.accepted.text
    }
  }
  return statusStyles[status] || statusStyles.applied
}

