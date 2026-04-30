import { format, isPast, parseISO } from 'date-fns'

/**
 * Format ISO date string → "Jan 15, 2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy')
  } catch {
    return dateStr
  }
}

/**
 * Format ISO datetime → "Jan 15, 2025 at 2:30 PM"
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy • hh:mm a')
  } catch {
    return dateStr
  }
}

/**
 * Check if a date string is in the past
 */
export function isOverdue(dateStr, status) {
  if (!dateStr || status === 'COMPLETED') return false
  return isPast(parseISO(dateStr))
}

/**
 * Get Tailwind color class for task priority
 */
export function getPriorityColor(priority) {
  switch (priority) {
    case 'HIGH':   return 'bg-red-100 text-red-700'
    case 'MEDIUM': return 'bg-amber-100 text-amber-700'
    case 'LOW':    return 'bg-green-100 text-green-700'
    default:       return 'bg-slate-100 text-slate-700'
  }
}

/**
 * Get Tailwind color class for task status
 */
export function getStatusColor(status) {
  switch (status) {
    case 'TODO':        return 'bg-slate-100 text-slate-700'
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700'
    case 'COMPLETED':   return 'bg-green-100 text-green-700'
    default:            return 'bg-slate-100 text-slate-700'
  }
}

/**
 * Get Tailwind color class for project status
 */
export function getProjectStatusColor(status) {
  switch (status) {
    case 'PLANNED':   return 'bg-slate-100 text-slate-700'
    case 'ACTIVE':    return 'bg-indigo-100 text-indigo-700'
    case 'COMPLETED': return 'bg-green-100 text-green-700'
    default:          return 'bg-slate-100 text-slate-700'
  }
}

/**
 * Get user initials for avatar
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Extract error message from axios error
 */
export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong'
  )
}