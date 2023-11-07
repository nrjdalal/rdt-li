'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { shortUrls } from '@/lib/db/schema'
import { nanoid } from '@/lib/utils'
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

export const getShortUrl = async ({ id }: { id: string }) => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Session not found')

  const shortUrlData = await db
    .select()
    .from(shortUrls)
    .where(eq(shortUrls.id, id))

  return shortUrlData
}

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

export const deleteShortUrl = async ({ id }: { id: string }) => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Session not found')

  const shortUrlData = await db.delete(shortUrls).where(eq(shortUrls.id, id))

  return shortUrlData // []
}
