import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'
import retry from 'p-retry'

export const dynamic = 'force-dynamic'

async function getData(slug: string) {
  const res = await retry(
    async () =>
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/redirect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      }),
    {
      retries: 5,
      onFailedAttempt: (error) => {
        console.log(error)
      },
    },
  )

  return res.json()
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug
  const data = await getData(slug)

  if (data.redirect) {
    permanentRedirect(data.redirect)
  }

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-4">
      <p className="text-sm text-foreground/50">
        {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}/{slug}
        &nbsp;
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
}

export default Page
