'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, Trash } from 'lucide-react'
import Link from 'next/link'
import { deleteShortUrl, getShortUrls } from './apis/shortUrls'

const Page = () => {
  const queryClient = useQueryClient()

  const { isError, isLoading, data } = useQuery({
    queryKey: ['shortUrls'],
    queryFn: async () => {
      return (await getShortUrls()).reverse()
    },
  })

  const mutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return await deleteShortUrl({
        id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shortUrls'],
      })
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
          <div className="flex font-mono text-xs">
            <Link
              className="text-blue-500"
              href={`/${shortUrl.id}`}
              target="_blank"
            >
              rdt.li/{shortUrl.id}
            </Link>

            <p>
              <span className="mx-2">→</span>
              {shortUrl.url}
            </p>
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
              <Eye className="h-3 w-3 text-slate-500" />
              <p className="pt-px">
                {shortUrl?.visits?.length ? shortUrl.visits.length : 0}
              </p>
              <Trash
                className="h-3 w-3 cursor-pointer text-red-500"
                onClick={() => {
                  mutation.mutate({ id: shortUrl.id })
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Page
