import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/redirect?slug=${slug}`,
  )

  const data = await res.json()

  if (res.status === 303) {
    permanentRedirect(data.redirect)
  }

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-4">
      <p className="text-sm text-foreground/50">
        {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}/{slug}
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
