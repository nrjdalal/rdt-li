'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
        <div className="container my-24 flex min-h-[100dvh] max-w-xl flex-col items-center gap-y-5 p-5 font-mono">
          <p className="font-sans font-medium">API Key</p>
          <p>Loading...</p>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <div className="container my-24 flex min-h-[100dvh] max-w-xl flex-col items-center gap-y-5 p-5 font-mono">
          <p className="font-sans font-medium">API Key</p>
          <p>Error</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="container my-24 flex min-h-[100dvh] max-w-xl flex-col items-center gap-y-5 p-5 font-mono">
        <Link className="mb-12 font-sans text-sm underline" href="/x">
          Back to Dashboard
        </Link>
        <p className="font-sans font-medium">API Key</p>

        {typeof data === 'string' ? (
          <>
            <Alert
              className="flex cursor-pointer select-none flex-col items-center gap-3 text-center"
              onClick={() => {
                navigator.clipboard.writeText(data)
                toast.success('Copied to clipboard')
              }}
            >
              <AlertTitle>{data.slice(0, 32) + ' ...'}</AlertTitle>
              <AlertDescription className="text-red-500">
                Save this key somewhere safe.
                <br />
                You will not be able to copy it again.
              </AlertDescription>
            </Alert>
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
            <Alert className="flex cursor-default select-none flex-col items-center gap-3 text-center">
              <AlertTitle>You have already generated a key!</AlertTitle>
              <AlertDescription className="text-red-500">
                You can generate a new key if you want.
                <br />
                Previous keys will be invalidated.
              </AlertDescription>
            </Alert>
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
