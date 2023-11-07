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

  const redirectUrl: any = await db
    .select({
      url: shortUrls.url,
      visits: shortUrls.visits,
      visits_v2: shortUrls.visits_v2,
    })
    .from(shortUrls)
    .where(eq(shortUrls.id, slug))

  if (redirectUrl.length) {
    const redirectUrlVisits_v2 = redirectUrl[0].visits_v2 || null

    const date = new Date()
      .toISOString()
      .split('T')[0]
      .slice(2)
      .replace(/-/g, '')

    if (!redirectUrlVisits_v2) {
      let redirectUrlVisits = redirectUrl[0].visits || []

      let newVisitData: any = []

      if (!redirectUrlVisits.length) {
        newVisitData = [date + 'x' + '1']
      } else {
        newVisitData = visitsV2(redirectUrlVisits)[0].startsWith(date)
          ? [
              date +
                'x' +
                (Number(visitsV2(redirectUrlVisits)[0].split('x')[1]) + 1),
              ...visitsV2(redirectUrlVisits).slice(1),
            ]
          : [date + 'x' + '1', ...visitsV2(redirectUrlVisits)]
      }

      await db.transaction(async () => {
        await db
          .update(shortUrls)
          .set({
            visits_v2: newVisitData,
            updatedAt: new Date(),
          })
          .where(eq(shortUrls.id, slug))
      })
    }

    if (redirectUrlVisits_v2) {
      let newVisitData: any = []

      newVisitData = redirectUrlVisits_v2[0].startsWith(date)
        ? [
            date + 'x' + (Number(redirectUrlVisits_v2[0].split('x')[1]) + 1),
            ...redirectUrlVisits_v2.slice(1),
          ]
        : [date + 'x' + '1', ...redirectUrlVisits_v2]

      await db.transaction(async () => {
        await db
          .update(shortUrls)
          .set({
            visits_v2: newVisitData,
            updatedAt: new Date(),
          })
          .where(eq(shortUrls.id, slug))
      })
    }

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

const visitsV2 = (array: any) => {
  return Object.entries(
    array
      .map((date: any) =>
        new Date(date).toISOString().split('T')[0].slice(2).replace(/-/g, ''),
      )
      .reduce((acc: any, cur: any) => {
        acc[cur] = (acc[cur] || 0) + 1
        return acc
      }, {}),
  )
    .map(([key, value]) => {
      return key + 'x' + value
    })
    .sort()
    .reverse()
}
