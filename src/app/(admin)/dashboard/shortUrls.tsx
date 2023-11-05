'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
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
          className="flex flex-col space-y-3 rounded-md border p-3 text-sm"
          key={shortUrl.id}
        >
          <div>
            <Link
              href={`/${shortUrl.id}`}
              className="font-mono text-xs text-blue-500"
            >
              rdt.li/{shortUrl.id}
            </Link>
            <span className="mx-2">→</span>
            <Link href={shortUrl.url} className="text-blue-500">
              {shortUrl.url}
            </Link>
          </div>

          <div className="text-xs">
            {shortUrl?.visits?.length || 'No visits yet!'}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Page
