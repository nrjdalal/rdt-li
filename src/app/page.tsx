import { db } from '@/lib/db'
import { shortUrls, users } from '@/lib/db/schema'
import { Anchor, ArrowDown, ExternalLink, Star, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeSwitcher } from './ThemeSwitcher'


export const revalidate = 60

export default async function Page() {
  const getUsers = await db.select().from(users)
  const getShortUrls = await db.select().from(shortUrls)
  const githubInfo = await fetch(
    'https://api.github.com/repos/nrjdalal/rdt-li',
  ).then((res) => res.json())

  return (
    <main className="container flex max-w-screen-md flex-col items-center p-5">
      
      <section className="space-y-6 pb-32 pt-6 md:pt-10 lg:py-32">
     
        <div className="container flex w-full max-w-[64rem] flex-col items-center gap-4 text-center">
        <div className="flex items-center"style={{marginLeft:'200px'}} >
          <Link
            href="https://rdt.li/lNB90I"
            className="rounded-2xl border bg-background px-4 py-1.5 text-xs font-medium"
             target="_blank"
            >
            @nrjdalal_com&apos;s twitter
           </Link>
           <div style={{marginLeft:'200px'}}>
           <ThemeSwitcher/>
           </div>
          </div>
         
          <h1 className="font-heading text-3xl sm:text-5xl">
            <span className="font-mono font-semibold">
              {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}
            </span>{' '}
            an open source
            <br />
            URL shortener
          </h1>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center space-y-1 rounded-md border-2 border-green-400 bg-green-100 px-8 py-3">
              <User className="h-8 w-8 text-green-600" />
              <p className="text-xs" style={{ color: 'black' }}>Uses</p>
              <p style={{ color: 'black' }}>{getUsers?.length}</p>
            </div>

            <div className="flex flex-col items-center space-y-1 rounded-md border-2 border-blue-400 bg-blue-100 px-8 py-3">
              <Anchor className="h-8 w-8 text-blue-600" />
              <p className="text-xs"style={{ color: 'black' }}>Short Links</p>
              <p style={{ color: 'black' }}>{getShortUrls?.length}</p>
            </div>

            {process.env.NEXT_PUBLIC_UMAMI_URL && (
              <Link
                className="col-span-2 flex flex-col items-center space-y-1 rounded-md border-2 border-red-400 bg-red-100 px-8 py-2"
                href={
                  `${process.env.NEXT_PUBLIC_UMAMI_SHARE_URL}` ||
                  'https://umami.is'
                }
                target="_blank"
              >
                <p className="flex gap-1 text-xs">
                  Optional Analytics by{' '}
                  <svg
                    className="rounded-full border"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 428 389.11"
                  >
                    <g data-name="Layer 2">
                      <g data-name="Layer 4">
                        <circle
                          cx="214.15"
                          cy="181"
                          r="171"
                          fill="#fff"
                          stroke="#000"
                          strokeMiterlimit="10"
                          strokeWidth="20"
                        ></circle>
                        <path d="M413 134.11H15.29a15 15 0 0 0-15 15v15.3C.12 168 0 171.52 0 175.11c0 118.19 95.81 214 214 214 116.4 0 211.1-92.94 213.93-208.67 0-.44.07-.88.07-1.33v-30a15 15 0 0 0-15-15z"></path>
                      </g>
                    </g>
                  </svg>{' '}
                  Umami
                  <ExternalLink className="h-4 w-4 text-foreground/50" />
                </p>
              </Link>
            )}
          </div>

          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Redirect.link is a URL shortener that shortens URL to{' '}
            {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}/slug and also
            tracks number of visits. It is built with Next.js, Drizzle, NextAuth
            and Postgres.
          </p>

          <p className="text-xs">
            Try now or <span className="font-semibold">self host</span> (check
            GitHub for more information)
          </p>

          <div className="mt-4 flex space-x-4">
            <Link
              href="/x"
              className="rounded-md bg-slate-900 px-8 py-2.5 text-white"
            >
              Login
            </Link>
            <Link
              href="https://rdt.li/WdWIbR"
              target="_blank"
              rel="noreferrer"
              className="relative flex gap-2 rounded-md border bg-background px-8 py-2.5"
            >
              <p>Github</p>
              <div className="absolute -top-3.5 right-2.5 flex items-center gap-1 rounded-md bg-foreground p-0.5 px-2 text-background">
                <Star className="h-2.5 w-2.5" />
                <p className="pt-0.5 font-mono text-[0.6rem] font-bold">
                  {githubInfo?.stargazers_count || 0}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <h2 className="flex cursor-default items-center text-xl font-medium">
        <ArrowDown className="text-blue-200" />
        <span className="ml-1 text-blue-500">Image Demo</span>
        <ArrowDown className="text-blue-300" />
      </h2>

      <Image
        src={'/demo.jpeg'}
        alt="rdt.li screenshot"
        width={1080}
        height={1080}
      />

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

          <div className="mt-4 flex gap-2">
            <Link href="https://vercel.com" target="_blank">
              <Image
                src="/powered-by-vercel.svg"
                alt="Powered by Vercel"
                height={32}
                width={128}
              />
            </Link>

            {process.env.NEXT_PUBLIC_UMAMI_URL && (
              <Link
                className="flex h-[26.56px] items-center gap-2 rounded-sm bg-black px-2 text-[0.6rem] text-background"
                href={
                  `${process.env.NEXT_PUBLIC_UMAMI_SHARE_URL}` ||
                  'https://umami.is'
                }
                target="_blank"
              >
                <svg
                  className="rounded-full border"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 428 389.11"
                >
                  <g data-name="Layer 2">
                    <g data-name="Layer 4">
                      <circle
                        cx="214.15"
                        cy="181"
                        r="171"
                        fill="#fff"
                        stroke="#000"
                        strokeMiterlimit="10"
                        strokeWidth="20"
                      ></circle>
                      <path d="M413 134.11H15.29a15 15 0 0 0-15 15v15.3C.12 168 0 171.52 0 175.11c0 118.19 95.81 214 214 214 116.4 0 211.1-92.94 213.93-208.67 0-.44.07-.88.07-1.33v-30a15 15 0 0 0-15-15z"></path>
                    </g>
                  </g>
                </svg>
                <p>
                  Analytics by <span className="font-medium">Umami</span>
                </p>
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
