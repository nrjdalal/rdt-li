'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDown, Clipboard, Copy } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { createPublicShortUrl } from './apis/publicUrls'

const formSchema = z.object({
  url: z.string().max(2048).url(),
})

export default function Page() {
  const [showPublic, setShowPublic] = useState(false)
  const [lastShortUrl, setLastShortUrl] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await createPublicShortUrl(values)
    setLastShortUrl(res[0]?.id)
    setShowPublic(true)
    form.reset()
  }

  return (
    <>
      {showPublic && (
        <Dialog
          open={showPublic}
          onOpenChange={() => setShowPublic(!showPublic)}
        >
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent className="flex w-11/12 flex-col items-center rounded-md">
            <p className="text-xs font-medium text-foreground/50">
              Here is your short URL
            </p>

            <div className="relative w-full rounded-md border p-1.5 text-center">
              <button className="absolute right-0 top-1/2 -mr-2.5 -mt-3.5 -translate-x-1/2 rounded-md p-1">
                <Copy
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_APP_URL}/${lastShortUrl}`,
                    )
                    toast.success('Copied to clipboard')
                  }}
                  className="h-5 w-5 text-blue-500"
                />
              </button>
              <Link
                className="text-center text-sm font-semibold"
                href={`/${lastShortUrl}`}
              >
                {process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]}/
                {lastShortUrl}
              </Link>
            </div>

            <p className="text-center text-[0.65rem] font-bold text-red-500">
              This link will be deleted in 24h.
              <br />
              To keep links and avail many other features, create an{' '}
              <Link
                className="border-b border-foreground border-red-500 font-semibold"
                href={'/dashboard'}
              >
                account
              </Link>
              .
            </p>

            <pre className="text-center font-sans text-[0.7rem]">
              • <span className="font-bold">Analytics</span>: All time, daily
              and unique views
              <br />• <span className="font-bold">Bar Charts</span>: Last 7 days
              views charted
              <br />• <span className="font-bold">Editable</span>: Edit titles,
              URLs and destinations easily
              <br />• <span className="font-bold">Filters</span>: Filter by
              create, views and more
              <br />• <span className="font-bold">Search</span>: Search for URLs
              with syntax highlighting
              <br />• <span className="font-bold">Theme</span>: Light (default)
              and dark mode
            </pre>

            <Link
              className="rounded-md bg-blue-500 px-3 py-1 text-xs font-semibold text-white"
              href="/dashboard"
            >
              It&apos;s 100% free! Try now!
            </Link>
          </DialogContent>
        </Dialog>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-16 w-full space-y-5"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-3 w-full pt-0.5 text-center text-sm font-semibold">
                  URL to shorten
                </FormLabel>

                <FormControl>
                  <Input
                    className="text-center font-mono placeholder:text-slate-400"
                    placeholder="https://github.com/nrjdalal"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Enter a valid https URL
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full font-medium" type="submit">
            Shorten
          </Button>
        </form>
      </Form>
    </>
  )
}
