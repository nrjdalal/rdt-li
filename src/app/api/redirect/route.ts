import { db } from '@/lib/db'
import { shortUrls } from '@/lib/db/schema'
import { smallDate } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { slug } = await request.json()

    const redirectLink = await db
      .select({
        userId: shortUrls.userId,
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

      if (!data.userId) {
        return NextResponse.json({ redirect: data.url, status: 303 })
      }

      if (data.clickLimit === 0) {
        if (data.enabled) {
          db.transaction(async () => {
            await db
              .update(shortUrls)
              .set({
                enabled: false,
              })
              .where(eq(shortUrls.id, slug))
          })
        }

        return NextResponse.json({
          message: 'Click limit reached',
          status: 423,
        })
      }

      if (!data.enabled)
        return NextResponse.json({ message: 'URL is not active', status: 423 })

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

      await db.transaction(async () => {
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

    return NextResponse.json({ message: "URL does't exist", status: 404 })
  } catch {
    return NextResponse.json({ message: 'Please try again', status: 409 })
  }
}
