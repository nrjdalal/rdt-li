'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { getShortUrls } from './apis/shortUrls'

const Page = () => {
  const queryClient = useQueryClient()

  const { isError, isLoading, data } = useQuery({
    queryKey: ['shortUrls'],
    queryFn: async () => {
      return (await getShortUrls()).reverse()
    },
  })

  isLoading && <p>Loading...</p>

  return (
    <div className="mt-5 flex flex-col space-y-5">
      {data?.map((shortUrl: { id: string; url: string; visits: any }) => (
        <div
          className="flex flex-col space-y-5 rounded-md border p-3 text-sm"
          key={shortUrl.id}
        >
          <div>
            <Link
              className="font-mono text-xs text-blue-500"
              href={`/${shortUrl.id}`}
              target="_blank"
            >
              rdt.li/{shortUrl.id}
            </Link>
            <span className="mx-2">→</span>
            <Link href={shortUrl.url} className="text-blue-500">
              {shortUrl.url}
            </Link>
          </div>

          <div className="flex justify-between text-xs">
            <div className="flex items-end font-mono text-[8px] text-slate-500">
              <p className="pt-0.5">
                {shortUrl?.visits?.length
                  ? `Last visited at ${new Date(
                      shortUrl.visits[0],
                    ).toLocaleString()}`
                  : ''}
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <Eye className="h-3 w-3 text-slate-600" />
              <p className="pt-px">
                {shortUrl?.visits?.length ? shortUrl.visits.length : 0}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Page
