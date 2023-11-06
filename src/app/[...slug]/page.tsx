import { db } from '@/lib/db'
import { shortUrls } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { permanentRedirect } from 'next/navigation'
import Link from 'next/link'

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug[0]

  const redirectUrl: any = await db
    .select({
      visits: shortUrls.visits,
      url: shortUrls.url,
    })
    .from(shortUrls)
    .where(eq(shortUrls.id, slug))

  if (redirectUrl.length) {
    const redirectUrlVisits = redirectUrl[0].visits || []

    await db.transaction(async () => {
      await db
        .update(shortUrls)
        .set({
          visits: [new Date().toUTCString(), ...redirectUrlVisits],
          updatedAt: new Date(),
        })
        .where(eq(shortUrls.id, slug))
    })

    permanentRedirect(redirectUrl[0].url)
  }

  return (
    <p className="w-full border-b-2 p-5 text-center">No such URL exists. Create new <Link href="/">{process.env.NEXT_PUBLIC_APP_URL}</Link></p>
  )
}

export default Page
