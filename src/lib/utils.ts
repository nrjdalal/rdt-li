import slugify from '@sindresorhus/slugify'
import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function nanoid(length = 8) {
  return customAlphabet(
    '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    length,
  )()
}

export const smallDate = (date: any) => {
  return date.toISOString().split('T')[0].slice(2).replace(/-/g, '')
}

export function sanitize(text: string) {
  return slugify(text, { decamelize: false, lowercase: false, separator: '-' })
}
