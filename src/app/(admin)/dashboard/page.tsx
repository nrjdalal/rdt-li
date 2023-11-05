'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

const Page = () => {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center gap-4">
      <Link
        href={'/'}
        className="rounded-md bg-slate-900 px-8 py-2.5 text-white"
      >
        Home
      </Link>
      <button
        className="rounded-md border px-8 py-2.5"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  )
}

export default Page
