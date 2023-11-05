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
import { signOut } from 'next-auth/react'
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
                <FormLabel className="text-md font-semibold">
                  URL to shorten
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
