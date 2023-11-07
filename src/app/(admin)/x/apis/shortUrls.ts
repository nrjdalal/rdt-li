'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { shortUrls } from '@/lib/db/schema'
import { nanoid } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'

// temp fx to be removed in future iterations
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

export const getShortUrls = async () => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Session not found')
  const shortUrlsData = await db
    .select()
    .from(shortUrls)
    .where(eq(shortUrls.userId, session.user.id))

  const withoutVisitsV2 = shortUrlsData
    .filter((shortUrlData) => !shortUrlData.visits_v2)
    .filter((shortUrlData) => !!shortUrlData.visits)

  console.log(
    '\n\x1b[35m=== src/lib/db/_operate.ts:58 ===\x1b[0m\n\n',
    withoutVisitsV2,
  )

  withoutVisitsV2.length &&
    (await db.transaction(async () => {
      for (const shortUrlData of shortUrlsData) {
        if (!!shortUrlData.visits_v2) continue
        if (!shortUrlData.visits) continue

        await db
          .update(shortUrls)
          .set({
            visits: null,
            visits_v2: visitsV2(shortUrlData.visits),
          })
          .where(eq(shortUrls.id, shortUrlData.id))
      }

      return await getShortUrls()
    }))

  return shortUrlsData
}

export const getShortUrl = async ({ id }: { id: string }) => {
  const shortUrlData = await db
    .select()
    .from(shortUrls)
    .where(eq(shortUrls.id, id))
  return shortUrlData
}

export const createShortUrl = async ({ url }: { url: string }) => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Session not found')
  // add check for valid url
  const shortUrl = await db.insert(shortUrls).values({
    userId: session.user.id,
    id: nanoid(6),
    url,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return shortUrl
}

export const deleteShortUrl = async ({ id }: { id: string }) => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Session not found')
  const shortUrl = await db.delete(shortUrls).where(eq(shortUrls.id, id))
  return shortUrl
}
