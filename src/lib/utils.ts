import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function generateDisplayName(): string {
  const adjectives = ['Kind', 'Gentle', 'Caring', 'Warm', 'Peaceful', 'Bright', 'Calm', 'Wise']
  const nouns = ['Heart', 'Soul', 'Spirit', 'Mind', 'Voice', 'Light', 'Hope', 'Dream']
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 999) + 1
  
  return `${adj}${noun}${num}`
}

export function generateDeviceToken(): string {
  return 'device_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36)
}

export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 12)
}