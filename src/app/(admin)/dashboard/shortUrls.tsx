'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Copy, Eye, Trash } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
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
          className="flex flex-col space-y-1.5 rounded-md border p-3 text-sm"
          key={shortUrl.id}
        >
          <div className="flex flex-col gap-1.5 font-mono text-xs">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-1 px-2">
                <Eye className="h-3 w-3 text-slate-500" />
                <p className="pt-px">
                  {shortUrl?.visits?.length ? shortUrl.visits.length : 0}
                </p>
              </div>

              <div className="flex gap-1.5 rounded-lg bg-blue-50 p-1 px-2 text-[0.6rem]">
                <Link
                  className="text-blue-500"
                  href={`/${shortUrl.id}`}
                  target="_blank"
                >
                  rdt.li/{shortUrl.id}
                </Link>
                <Copy
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://rdt.li/${shortUrl.id}`,
                    )
                    toast.success('Copied to clipboard')
                  }}
                  className="ml-1 mt-0.5 h-3 w-3 cursor-pointer text-slate-500"
                />
                <Trash
                  className="mt-0.5 h-3 w-3 cursor-pointer text-red-500"
                  onClick={() => {
                    mutation.mutate({ id: shortUrl.id })
                    toast.info('Deleted')
                  }}
                />
              </div>
            </div>
            <p className="line-clamp-2 break-all">{shortUrl.url}</p>
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
          </div>
        </div>
      ))}
    </div>
  )
}

export default Page
