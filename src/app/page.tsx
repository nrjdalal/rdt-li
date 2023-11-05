import Link from 'next/link'

export default async function Page() {
  return (
    <main className="flex flex-col items-center p-5">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href="https://rdt.li/lNB90I"
            className="rounded-2xl border bg-muted bg-slate-100 px-4 py-1.5 text-xs font-medium"
            target="_blank"
          >
            Follow creator on Twitter
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl">
            An open source URL shortener.
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Redirect.link is a URL shortener that shortens URL to rdt.li/slug
            and also tracks number of visits. It is built with Next.js, Drizzle,
            NextAuth and Postgres.
          </p>
          <div className="mt-4 space-x-4">
            <Link
              href="/access"
              className="rounded-md bg-slate-900 px-8 py-2.5 text-white"
            >
              Login
            </Link>
            <Link
              href="https://rdt.li/WdWIbR"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border px-8 py-2.5"
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>

      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl">
            Proudly Open Source
          </h2>
          <p className="max-w-[85%] text-xs leading-normal text-muted-foreground">
            Redirect.link is open source and powered by open source software.
            The source code is available on{' '}
            <Link
              href="https://rdt.li/WdWIbR"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
