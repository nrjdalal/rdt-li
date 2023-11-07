import { db } from '@/lib/db'
import { shortUrls } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const getShortUrls = async () => {
  const shortUrlsData = await db
    .select({ id: shortUrls.id, visits: shortUrls.visits })
    .from(shortUrls)
  return shortUrlsData
}

console.log(
  await db.transaction(async () => {
    const shortUrlsData = await getShortUrls()
    console.log(
      '\n\x1b[35m=== src/lib/db/_operate.ts:58 ===\x1b[0m\n\n',
      shortUrlsData.length,
    )
    for (const shortUrlData of shortUrlsData) {
      await db
        .update(shortUrls)
        .set({
          visits: shortUrlData?.visits
            ? Object.entries(
                shortUrlData.visits
                  ?.map((date) =>
                    new Date(date)
                      .toISOString()
                      .split('T')[0]
                      .slice(2)
                      .replace(/-/g, ''),
                  )
                  .reduce((acc: any, cur) => {
                    acc[cur] = (acc[cur] || 0) + 1
                    return acc
                  }, {}),
              ).map(([key, value]) => {
                return key + 'x' + value
              })
            : null,
        })
        .where(eq(shortUrls.id, shortUrlData.id))
    }
  }),
)

// ["Tue, 07 Nov 2023 10:41:21 GMT","Tue, 07 Nov 2023 10:40:21 GMT","Tue, 07 Nov 2023 10:40:11 GMT","Mon, 06 Nov 2023 10:39:56 GMT","Mon, 06 Nov 2023 10:37:53 GMT","Mon, 06 Nov 2023 10:37:34 GMT","Sun, 05 Nov 2023 10:36:47 GMT","Sun, 05 Nov 2023 10:36:27 GMT","Sun, 05 Nov 2023 10:36:05 GMT","Sun, 05 Nov 2023 10:34:37 GMT","Sun, 05 Nov 2023 10:33:09 GMT","Sat, 04 Nov 2023 10:32:26 GMT","Sat, 04 Nov 2023 10:29:02 GMT","Sat, 03 Nov 2023 10:28:59 GMT","Fri, 02 Nov 2023 10:13:51 GMT"]
