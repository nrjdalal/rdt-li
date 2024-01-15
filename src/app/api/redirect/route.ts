import { db } from '@/lib/db'
import { publicShortUrls, shortUrls } from '@/lib/db/schema'
import { smallDate } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { slug } = await request.json()

    // public urls
    if (slug?.startsWith('_')) {
      const redirectLink: any = await db
        .select({
          url: publicShortUrls.url,
        })
        .from(publicShortUrls)
        .where(eq(publicShortUrls.id, slug))

      if (redirectLink.length) {
        return NextResponse.json({ redirect: redirectLink[0].url, status: 303 })
      }
    }

    // private urls
    const redirectLink = await db
      .select({
        url: shortUrls.url,
        visits: shortUrls.visits,
        enabled: shortUrls.enabled,
        clickLimit: shortUrls.clickLimit,
        timeOffset: shortUrls.timeOffset,
      })
      .from(shortUrls)
      .where(eq(shortUrls.id, slug))

    if (redirectLink.length) {
      const data = redirectLink[0]

      if (!data.enabled)
        return NextResponse.json({ message: 'is not active', status: 423 })

      if (data.clickLimit === 0)
        return NextResponse.json({
          message: 'has reached the click limit',
          status: 423,
        })

      if (typeof data.clickLimit === 'number') {
        data.clickLimit -= 1
        if (data.clickLimit === 0) {
          data.enabled = false
        }
      }

      const zeroTime = new Date().toISOString()
      const localTime = new Date(
        new Date(zeroTime).getTime() + data.timeOffset * -60 * 1000,
      )
      const onlyDate = smallDate(localTime)

      const visits = data.visits || []

      const newVisitData = visits[0]?.startsWith(onlyDate)
        ? [
            onlyDate + 'x' + (Number(visits[0].split('x')[1]) + 1),
            ...visits.slice(1),
          ]
        : [onlyDate + 'x1', ...visits]

      db.transaction(async () => {
        await db
          .update(shortUrls)
          .set({
            visits: newVisitData,
            lastVisit: localTime,
            enabled: data.enabled,
            clickLimit: data.clickLimit,
          })
          .where(eq(shortUrls.id, slug))
      })

      if (redirectLink.length) {
        return NextResponse.json({ redirect: data.url, status: 303 })
      }
    }

    return NextResponse.json({ message: "doesn't exist", status: 404 })
  } catch {
    return NextResponse.json({ message: '-> please try again', status: 409 })
  }
}
