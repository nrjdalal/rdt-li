import { db } from '@/lib/db'
import { shortUrls } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug[0]

  // optional: umami analytics
  try {
    if (process.env.NEXT_PUBLIC_UMAMI_URL) {
      const Headers = headers()

      const umami = {
        payload: {
          host: Headers.get('host'),
          language: 'en-US',
          referrer: Headers.get('referer'),
          screen: '1x1',
          title: 'Umami',
          url: `/${slug}`,
          website: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
          name: slug,
        },
        type: 'event',
      }

      fetch(`${process.env.NEXT_PUBLIC_UMAMI_URL}/api/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': Headers.get('user-agent') || 'Unknown Device',
        },
        body: JSON.stringify(umami),
      })
    }
  } catch {
    console.log('Umami error!')
  }

  const redirectUrl: any = await db
    .select({
      visits: shortUrls.visits,
      url: shortUrls.url,
    })
    .from(shortUrls)
    .where(eq(shortUrls.id, slug))

  if (redirectUrl.length) {
    const redirectUrlVisits = redirectUrl[0].visits || []

    await db.transaction(async () => {
      await db
        .update(shortUrls)
        .set({
          visits: [new Date().toUTCString(), ...redirectUrlVisits],
          updatedAt: new Date(),
        })
        .where(eq(shortUrls.id, slug))
    })

    permanentRedirect(redirectUrl[0].url)
  }

  return (
    <p className="w-full border-b-2 p-5 text-center">
      No such URL exists. Create new at{' '}
      <Link className="underline" href="/">
        {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}
      </Link>
    </p>
  )
}

export default Page
