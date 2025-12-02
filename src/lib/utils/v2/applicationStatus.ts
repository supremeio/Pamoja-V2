import React from 'react'
import { colors } from '@/lib/colors/v2'

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
      backgroundColor: colors.status.applied.bg,
      borderColor: colors.status.applied.border,
      color: colors.status.applied.text
    },
    rejected: {
      backgroundColor: colors.status.rejected.bg,
      borderColor: colors.status.rejected.border,
      color: colors.status.rejected.text
    },
    interview: {
      backgroundColor: colors.status.interview.bg,
      borderColor: colors.status.interview.border,
      color: colors.status.interview.text
    },
    offer: {
      backgroundColor: colors.status.offer.bg,
      borderColor: colors.status.offer.border,
      color: colors.status.offer.text
    },
    accepted: {
      backgroundColor: colors.status.accepted.bg,
      borderColor: colors.status.accepted.border,
      color: colors.status.accepted.text
    }
  }
  return statusStyles[status] || statusStyles.applied
}
