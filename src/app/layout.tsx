import './globals.css'
import { fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import Head from 'next/head'
import Script from 'next/script'
import { Toaster } from 'sonner'
import Provider from './provider'

export const metadata: Metadata = {
  title: 'Redirect.link',
  description: 'An open source URL shortener.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-[100dvh] bg-secondary font-sans antialiased',
          fontMono.variable,
          fontSans.variable,
        )}
      >
        <Provider>
          {children}
          <Toaster expand={true} richColors />
        </Provider>
      </body>

      {process.env.NEXT_PUBLIC_APP_URL === 'https://rdt.li' && (
        <Script
          async
          defer
          src="https://umami-rdt-li.vercel.app/script.js"
          data-website-id="27fe7c5f-3f22-4efa-8d44-aff3d5dadc51"
        />
      )}
    </html>
  )
}
