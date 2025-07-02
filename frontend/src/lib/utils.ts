import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDefaultError(error: unknown): error is { message: string } {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return typeof (error as { message: unknown }).message === 'string'
  }
  return false
}

export function timeAgoFromTimestamp(timestamp: string | number): string {
  const seconds = typeof timestamp === 'string' ? parseFloat(timestamp) : timestamp
  const date = new Date(seconds * 1000)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`
  return `${Math.floor(diff / 31536000)} years ago`
}
