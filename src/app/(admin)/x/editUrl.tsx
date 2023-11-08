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
import { updateShortUrl } from './apis/shortUrls'

const formSchema = z.object({
  newId: z.string(),
  title: z.string().optional(),
  url: z.string().url(),
})

export default function Page({
  id,
  title,
  url,
}: {
  id: string
  title: any
  url: string
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newId: id,
      title: title || '',
      url,
    },
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return await updateShortUrl({
        id,
        ...values,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shortUrls'],
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutation.mutateAsync(values)
  }

  const domain: any = process.env.NEXT_PUBLIC_APP_URL?.split('://')[1]

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-5 py-5 font-mono text-xs"
      >
        <FormField
          control={form.control}
          name="newId"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <div className="relative">
                  <FormLabel className="absolute -top-[9px] left-4 bg-background px-2 text-xs text-foreground/70">
                    Short URL
                  </FormLabel>
                  <p className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">
                    {domain}/
                  </p>
                  <Input
                    className="text-xs"
                    placeholder="nrjdalal"
                    style={{
                      paddingLeft: domain?.length * 8.75,
                    }}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FormLabel className="absolute -top-[9px] left-4 bg-background px-2 text-xs text-foreground/70">
                    Title
                  </FormLabel>
                  <Input
                    className="font-sans text-xs placeholder:text-foreground/40"
                    placeholder="e.g. My Instagram Profile"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FormLabel className="absolute -top-[9px] left-4 bg-background px-2 text-xs text-foreground/70">
                    Redirect URL
                  </FormLabel>
                  <Input
                    className="font-sans text-xs"
                    placeholder="shadcn"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
