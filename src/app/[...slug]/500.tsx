import Link from 'next/link'

export default function Custom404({ params }: { params: { slug: string } }) {
  const slug = params.slug[0]

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-4">
      <p className="text-sm text-foreground/50">
        Ahh! Hope you have a pleasent visit{' '}
        <Link
          className="animate-pulse text-sm font-bold text-orange-500 underline"
          href={`/${slug}`}
        >
          {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}/{slug}
        </Link>
      </p>

      <p className="text-sm">
        Create short URLs at{' '}
        <Link className="text-sm font-bold text-orange-500 underline" href="/">
          {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}
        </Link>
      </p>
    </div>
  )
}
