'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { shortUrls } from '@/lib/db/schema'
import { nanoid, sanitize } from '@/lib/utils'
import { eq } from 'drizzle-orm'
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

// ~ unused for now

// export const getShortUrl = async ({ id }: { id: string }) => {
//   const session = await getServerSession(authOptions)
//   if (!session) throw new Error('Session not found')

//   const shortUrlData = await db
//     .select()
//     .from(shortUrls)
//     .where(eq(shortUrls.id, id))

//   return shortUrlData
// }

export const createShortUrl = async ({ url }: { url: string }) => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Session not found')

  const shortUrlData = await db.insert(shortUrls).values({
    userId: session.user.id,
    id: nanoid(6),
    url,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return shortUrlData // []
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

  try {
    const shortUrlData = await db
      .update(shortUrls)
      .set({
        id: sanitize(newId) || id,
        title: title || null,
        url,
        updatedAt: new Date(),
      })
      .where(eq(shortUrls.userId, session.user.id))
      .where(eq(shortUrls.id, id))

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
