'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { toast } from 'sonner'
import { getApiKey } from '../apis/shortUrls'

const Page = () => {
  const queryClient = useQueryClient()

  const { isPending, isError, data } = useQuery({
    queryKey: ['key'],
    queryFn: async () => {
      return await getApiKey({
        intent: 'auto',
      })
    },
  })

  const mutation = useMutation({
    mutationFn: async () => {
      return await getApiKey({ intent: 'new' })
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['key'], data)
    },
  })

  if (isPending) {
    return (
      <>
        <div className="container my-24 flex min-h-[100dvh] max-w-xl flex-col items-center gap-y-4 p-5 font-mono">
          <p className="font-sans">API Key</p>
          <p>Loading...</p>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <div className="container my-24 flex min-h-[100dvh] max-w-xl flex-col items-center gap-y-4 p-5 font-mono">
          <p className="font-sans">API Key</p>
          <p>Error</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="container my-24 flex min-h-[100dvh] max-w-xl flex-col items-center gap-y-4 p-5 font-mono">
        <Link href="/x">Back</Link>
        <p className="mb-12 font-sans text-xl font-semibold">API Key</p>

        {typeof data === 'string' ? (
          <>
            <p className="select-none">{data.slice(0, 32) + ' ...'}</p>
            <div className="flex gap-4">
              <button
                className="rounded-md bg-black px-6 py-1.5 text-white hover:bg-blue-500"
                onClick={() => {
                  navigator.clipboard.writeText(data)
                  toast.success('Copied to clipboard')
                }}
              >
                Copy
              </button>
              <button
                className="rounded-md bg-black px-6 py-1.5 text-white hover:bg-blue-500"
                onClick={() => {
                  mutation.mutate()
                }}
              >
                Generate New
              </button>
            </div>
          </>
        ) : (
          <>
            <p>API Key Already exists!</p>
            <button
              className="rounded-md bg-black px-6 py-1.5 text-white hover:bg-blue-500"
              onClick={() => {
                mutation.mutate()
              }}
            >
              Generate New
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default Page
