import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function createExportFileName(params: {
  type: 'resume' | 'cover-letter'
  fullName?: string | null
  company?: string | null
  role?: string | null
  ext: 'pdf' | 'docx'
}) {
  const parts: string[] = []
  if (params.fullName) parts.push(params.fullName.trim().replace(/\s+/g, '_'))
  parts.push(params.type === 'resume' ? 'Resume' : 'Cover_Letter')
  if (params.company) parts.push(params.company.trim().replace(/\s+/g, '_'))
  if (params.role) parts.push(params.role.trim().replace(/\s+/g, '_'))
  const base = parts.join('_') || `${params.type}`
  return `${base}.${params.ext}`
}

export function buildExportMeta(params: {
  type: 'resume' | 'cover-letter'
  fullName?: string | null
  keywords?: string[]
}) {
  const title = params.type === 'resume' ? 'Resume' : 'Cover Letter'
  return {
    type: params.type,
    fullName: params.fullName || undefined,
    title,
    keywords: params.keywords || []
  }
}
