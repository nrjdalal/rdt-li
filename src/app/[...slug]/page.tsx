import { db } from '@/lib/db'
import { publicShortUrls, shortUrls } from '@/lib/db/schema'
import { smallDate } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'
import retry from 'p-retry'

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
          name: `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`,
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

  // ~ public short urls
  if (slug.startsWith('_')) {
    const redirectLink: any = await retry(
      async () =>
        await db
          .select({
            url: publicShortUrls.url,
          })
          .from(publicShortUrls)
          .where(eq(publicShortUrls.id, slug)),
      {
        retries: 3,
        onFailedAttempt: (error) => {
          console.log('Retrying redirectLink', error)
        },
      },
    )

    redirectLink.length && permanentRedirect(redirectLink[0].url)
  }

  // ~ private short urls
  const shortUrlData: any = await retry(
    async () =>
      await db
        .select({
          url: shortUrls.url,
          visits: shortUrls.visits,
          enabled: shortUrls.enabled,
          clickLimit: shortUrls.clickLimit,
        })
        .from(shortUrls)
        .where(eq(shortUrls.id, slug)),
    {
      retries: 3,
      onFailedAttempt: (error) => {
        console.log('Retrying shortUrlData', error)
      },
    },
  )

  if (shortUrlData.length) {
    const data = {
      url: shortUrlData[0].url,
      visits: shortUrlData[0].visits,
      enabled: shortUrlData[0].enabled,
      clickLimit: shortUrlData[0].clickLimit,
    }

    if (data.clickLimit === 0) {
      return (
        <div className="flex h-[100dvh] flex-col items-center justify-center gap-4">
          <p className="text-sm text-foreground/50">
            {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}/{slug} has
            reached the click limit
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

    if (!data.enabled) {
      return (
        <div className="flex h-[100dvh] flex-col items-center justify-center gap-4">
          <p className="text-sm text-foreground/50">
            {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}/{slug} is not
            active
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

    if (data.enabled && typeof data.clickLimit === 'number') {
      data.clickLimit -= 1
      if (data.clickLimit === 0) {
        data.enabled = false
      }
    }

    try {
      const date = smallDate()
      const visits = data.visits || []

      const newVisitData = visits[0]?.startsWith(date)
        ? [
            date + 'x' + (Number(visits[0].split('x')[1]) + 1),
            ...visits.slice(1),
          ]
        : [date + 'x1', ...visits]

      db.transaction(async () => {
        await db
          .update(shortUrls)
          .set({
            visits: newVisitData,
            lastVisit: new Date(),
            enabled: data.enabled,
            clickLimit: data.clickLimit,
          })
          .where(eq(shortUrls.id, slug))
      })
    } catch {
      console.log('Error updating visits')
    }

    permanentRedirect(data.url)
  }

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-4">
      <p className="text-sm text-foreground/50">
        {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}/{slug} doesn&apos;t
        exists
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
