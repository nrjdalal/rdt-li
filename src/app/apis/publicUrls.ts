'use server'

import { db } from '@/lib/db'
import { shortUrls } from '@/lib/db/schema'
import { nanoid } from '@/lib/utils'
import { blocked } from '@/url-center/blocked'
import { and, count, isNull, like, lt, sql } from 'drizzle-orm'

export const createPublicShortUrl = async ({ url }: { url: string }) => {
  for (const blockedUrl of blocked) {
    if (new URL(url).host.includes(blockedUrl)) {
      try {
        await db.delete(shortUrls).where(like(shortUrls.url, `%${blockedUrl}%`))
      } catch {
        console.log('Error deleting old publicShortUrls')
      }

      return {
        error: {
          code: 406,
          message: 'URL not acceptable or is blocked',
        },
      }
    }
  }

  try {
    await db
      .delete(shortUrls)
      .where(
        and(
          isNull(shortUrls.userId),
          lt(shortUrls.createdAt, sql`NOW() - INTERVAL '24 hours'`),
        ),
      )
  } catch {
    console.log('Error deleting old publicShortUrls')
  }

  try {
    const existingShortUrl = await db
      .select({ value: count() })
      .from(shortUrls)
      .where(
        and(
          isNull(shortUrls.userId),
          like(shortUrls.url, `%${new URL(url).host}%`),
        ),
      )

    if (existingShortUrl[0].value > 100) {
      return {
        error: {
          code: 409,
          message: 'URL marked as spam for the next 24 hours',
        },
      }
    }
  } catch {
    console.log('Error checking existing publicShortUrls')
  }

  const shortUrlData = await db
    .insert(shortUrls)
    .values({
      userId: null,
      id: nanoid(6),
      url,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      id: shortUrls.id,
      url: shortUrls.url,
    })

  return shortUrlData // []
}
