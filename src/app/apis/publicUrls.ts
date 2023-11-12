'use server'

import { db } from '@/lib/db'
import { publicShortUrls } from '@/lib/db/schema'
import { nanoid } from '@/lib/utils'

export const createPublicShortUrl = async ({ url }: { url: string }) => {
  const shortUrlData = await db
    .insert(publicShortUrls)
    .values({
      id: '_' + nanoid(5),
      url,
      createdAt: new Date(),
    })
    .returning({
      id: publicShortUrls.id,
      url: publicShortUrls.url,
    })

  console.log('shortUrlData', shortUrlData)

  return shortUrlData // []
}
