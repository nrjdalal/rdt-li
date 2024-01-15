import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'
import retry from 'p-retry'

export const dynamic = 'force-dynamic'

async function getData(slug: string) {
  try {
    const res = await retry(
      async () => {
        const pRes = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/redirect`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slug }),
          },
        )

        if (pRes.status !== 200) {
          throw new Error('Failed to fetch')
        }

        return pRes
      },
      {
        retries: 2,
        onFailedAttempt: (error) => {
          console.log(error)
        },
      },
    )

    return res.json()
  } catch {
    return { message: 'Click to visit', status: 409 }
  }
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug
  const data = await getData(slug)

  if (data.redirect) {
    permanentRedirect(data.redirect)
  }

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-4">
      <Link
        href={`/${slug}`}
        className="text-center text-sm text-foreground/50"
      >
        {data.message}
        <br />
        {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}/{slug}
      </Link>

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
