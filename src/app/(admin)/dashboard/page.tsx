'use client'

import { Button } from '@/components/ui/button'
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, StarIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { createShortUrl } from './apis/shortUrls'
import ShowUrl from './shortUrls'

const formSchema = z.object({
  url: z.string().url(),
})

export default function Page() {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return await createShortUrl(values)
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries('shortUrls')
      form.reset()
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutation.mutateAsync(values)
  }

  return (
    <div className="container flex min-h-[100dvh] max-w-3xl flex-col p-5 font-mono">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md flex items-center justify-between font-semibold">
                  <p>URL to shorten</p>
                  <Link
                    href="https://rdt.li/Ri4uZw"
                    target="_blank"
                    className="flex items-center gap-1.5 rounded-md bg-blue-500 px-3 py-0.5 text-[0.6rem] text-white"
                  >
                    <p className="mt-0.5">Github</p>
                    <Star className="h-3.5 w-3.5" />
                  </Link>
                </FormLabel>
                <FormControl>
                  <Input
                    className="font-mono placeholder:text-slate-400"
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

      <Button
        className="mt-5 font-medium"
        onClick={() => signOut()}
        variant={'outline'}
      >
        Sign Out
      </Button>

      <ShowUrl />
    </div>
  )
}
