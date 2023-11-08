'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { Provider as Jotai } from 'jotai'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useEffect,useState } from 'react'

export default function ThemeProviderProps({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  

  if (!mounted) {
    return <>{children}</>
  }


  return (
    // <Jotai>
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
       {children}
      </NextThemesProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    // </Jotai>
  )
}
