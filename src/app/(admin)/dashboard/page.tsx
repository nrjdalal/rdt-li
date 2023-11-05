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
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { createShortUrl, getShortUrls } from './apis/shortUrls'
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
    <div className="container flex min-h-[100dvh] max-w-3xl flex-col p-5">
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
                <FormLabel>URL to shorten</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/nrjdalal" {...field} />
                </FormControl>
                <FormDescription>Enter a valid https URL</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <ShowUrl />
    </div>
  )
}
