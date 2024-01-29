'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPublicShortUrls } from '../apis/publicUrls'

const Page = () => {
  const { isPending, isError, data } = useQuery({
    queryKey: ['publicShortUrls'],
    queryFn: async () => {
      return await getPublicShortUrls()
    },
  })

  if (isPending) {
    return (
      <>
        <div className="container w-full p-5 text-center">
          <div className="mb-1.5 flex flex-col gap-1">
            <div className="rounded-md bg-foreground p-[0.2rem] px-2 text-[0.65rem] font-light text-background">
              <p className="font-bold">Loading...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <div className="container w-full p-5 text-center">
          <div className="mb-1.5 flex flex-col gap-1">
            <div className="rounded-md bg-foreground p-[0.2rem] px-2 text-[0.65rem] font-light text-background">
              <p className="font-bold">Error</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="container w-full p-5 text-center">
        {data?.map((url: any, key: number) => {
          return (
            <div className="mb-1.5 flex flex-col gap-1" key={key}>
              <div className="rounded-md bg-foreground p-[0.2rem] px-2 text-[0.65rem] font-light text-background">
                <p className="font-bold">{url.id}</p>
                {url.url}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Page
