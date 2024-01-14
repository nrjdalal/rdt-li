'use server'

import { db } from '@/lib/db'
import { publicShortUrls } from '@/lib/db/schema'
import { nanoid } from '@/lib/utils'
import { blocked } from '@/url-center/blocked'

export const createPublicShortUrl = async ({ url }: { url: string }) => {
  for (const blockedUrl of blocked) {
    if (url.includes(blockedUrl)) {
      return {
        error: {
          code: 406,
          message: 'URL not acceptable or is blocked',
        },
      }
    }
  }

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
