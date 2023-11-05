import {
  JetBrains_Mono as FontMono,
  DM_Sans as FontSans,
} from 'next/font/google'

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})
