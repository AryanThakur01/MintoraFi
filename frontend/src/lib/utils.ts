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
