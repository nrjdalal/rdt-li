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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { updateShortUrl } from './apis/shortUrls'

const formSchema = z.object({
  newId: z.string().min(4).max(64),
  title: z.string().max(64).optional(),
  url: z.string().max(2048).url(),
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
  const [open, setOpen] = useState(false)

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
      const res: any = await updateShortUrl({
        id,
        ...values,
      })

      if (res?.error) {
        throw new Error(JSON.stringify(res?.error))
      }

      return res
    },
    onSuccess: () => {
      setOpen(false)
      queryClient.invalidateQueries({
        queryKey: ['shortUrls'],
      })
    },
    onError: (error) => {
      return toast.error(JSON.parse(error.message).message)
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutation.mutateAsync(values)
  }

  const domain: any = process.env.NEXT_PUBLIC_APP_URL?.split('://')[1] + '/'

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex h-full w-full items-center justify-between rounded-sm p-1 px-2 text-[0.675rem]">
        <p className="text-foreground/80">Edit</p>
        <Pencil className="h-3 w-3 text-foreground/80" />
      </SheetTrigger>
      <SheetContent className="w-11/12 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-sm">Let&apos;s edit the URL</SheetTitle>
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
                          {domain}
                        </p>
                        <Input
                          className="text-xs"
                          placeholder="nrjdalal"
                          style={{
                            paddingLeft: `${
                              1 +
                              domain?.length * 0.45 +
                              (domain?.length - 1) * 0.01
                            }rem`,
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
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
