import { db } from '@/lib/db'
import { shortUrls } from '@/lib/db/schema'
import { smallDate } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'
import retry from 'p-retry'

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/redirect?slug=${slug}`,
  )

  const data = await res.json()

  if (res.status === 303) {
    permanentRedirect(data.redirect)
  }

  if (data.message)
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-foreground/50">
          {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}/{slug}{' '}
          {data.message}
        </p>

        <p className="text-sm">
          Create short URLs at{' '}
          <Link
            className="animate-pulse text-sm font-bold text-orange-500 underline"
            href="/"
          >
            {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}
          </Link>
        </p>
      </div>
    )

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-4">
      <p className="text-sm text-foreground/50">
        Something went wrong. Please try again later.
      </p>

      <p className="text-sm">
        Create short URLs at{' '}
        <Link
          className="animate-pulse text-sm font-bold text-orange-500 underline"
          href="/"
        >
          {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}
        </Link>
      </p>
    </div>
  )
}

export default Page
