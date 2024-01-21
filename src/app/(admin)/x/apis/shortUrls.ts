'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { shortUrls } from '@/lib/db/schema'
import { nanoid, sanitize } from '@/lib/utils'
import { blocked } from '@/url-center/blocked'
import { and, eq, like } from 'drizzle-orm'
import { getServerSession } from 'next-auth'

export const getShortUrls = async () => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Session not found')

  const shortUrlsData = await db
    .select()
    .from(shortUrls)
    .where(eq(shortUrls.userId, session.user.id))

  return shortUrlsData
}

export const createShortUrl = async ({
  id,
  url,
  title,
  enabled,
  clickLimit,
  password,
  timeOffset,
}: {
  id: string
  url: string
  title: string
  enabled: string
  clickLimit: string | number | null
  password: string
  timeOffset: number
}) => {
  for (const blockedUrl of blocked) {
    if (new URL(url).host.includes(blockedUrl)) {
      try {
        await db.delete(shortUrls).where(like(shortUrls.url, `%${blockedUrl}%`))
      } catch {
        console.log('Error deleting old shortUrls')
      }

      return {
        error: {
          code: 406,
          message: 'URL not acceptable or is blocked',
        },
      }
    }
  }

  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Session not found')

  if (clickLimit && isNaN(Number(clickLimit))) {
    return { error: { code: '400', message: 'Click limit is not a number' } }
  }

  const data = {
    userId: session.user.id,
    id: sanitize(id) || nanoid(6),
    url,
    title: title || null,
    enabled: enabled === 'true' ? true : enabled === 'false' ? false : null,
    clickLimit: Number(clickLimit) || null,
    password: password || null,
    timeOffset: Number(timeOffset) || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  if (data.id.startsWith('_')) {
    return {
      error: {
        code: '400',
        message: 'Short URL cannot start with an underscore',
      },
    }
  }

  try {
    const shortUrlData = await db.insert(shortUrls).values(data)
    return shortUrlData // []
  } catch (error: any) {
    if (error?.code === '23505') {
      return {
        error: {
          code: '23505',
          message: 'Short URL already exists',
        },
      }
    } else {
      return {
        error: {
          code: '500',
          message: error.message,
        },
      }
    }
  }
}

export const updateShortUrl = async ({
  id,
  newId,
  title,
  url,
}: {
  id: string
  newId: string
  title?: string | undefined
  url: string
}) => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Session not found')

  const xid = newId || id

  if (xid.startsWith('_')) {
    return {
      error: {
        code: '400',
        message: 'Short URL cannot start with an underscore',
      },
    }
  }

  try {
    const shortUrlData = await db
      .update(shortUrls)
      .set({
        id: sanitize(xid),
        title: title || null,
        url,
        updatedAt: new Date(),
      })
      .where(and(eq(shortUrls.userId, session.user.id), eq(shortUrls.id, id)))

    return shortUrlData // []
  } catch (error: any) {
    if (error?.code === '23505') {
      return {
        error: {
          code: '23505',
          message: 'Short URL already exists',
        },
      }
    } else {
      return {
        error: {
          code: '500',
          message: error.message,
        },
      }
    }
  }
}

export const deleteShortUrl = async ({ id }: { id: string }) => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Session not found')

  const shortUrlData = await db.delete(shortUrls).where(eq(shortUrls.id, id))

  return shortUrlData // []
}
