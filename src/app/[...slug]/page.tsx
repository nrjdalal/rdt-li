import { db } from '@/lib/db'
import { shortUrls } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { permanentRedirect } from 'next/navigation'

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug[0]

  let redirectUrl: any = await db
    .select({
      visits: shortUrls.visits,
    })
    .from(shortUrls)
    .where(eq(shortUrls.id, slug))

  redirectUrl = redirectUrl[0].visits || []

  if (redirectUrl.length) {
    const update = await db
      .update(shortUrls)
      .set({
        visits: [new Date().toUTCString(), ...redirectUrl],
        updatedAt: new Date(),
      })
      .where(eq(shortUrls.id, slug))
      .returning({
        url: shortUrls.url,
      })

    permanentRedirect(update[0].url)
  }

  return (
    <p className="w-full border-b-2 p-5 text-center">No such URL exists.</p>
  )
}

export default Page
