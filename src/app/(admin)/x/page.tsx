'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Home, Laptop, Moon, Star, Sun } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { createShortUrl } from './apis/shortUrls'
import ShowUrl from './shortUrls'

const formSchema = z.object({
  id: z.string().max(128),
  url: z.string().max(2048).url(),
  title: z.string().max(128),
})

export default function Page() {
  const { setTheme, theme } = useTheme()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      url: '',
      title: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res: any = await createShortUrl(values)

      if (res?.error) {
        throw new Error(JSON.stringify(res?.error))
      }

      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shortUrls'],
      })
      form.reset()
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
    <div className="container flex min-h-[100dvh] max-w-3xl flex-col p-5 font-mono">
      {/* <Alert className="mb-5" variant="default">
        <AlertTitle className="text-xs font-semibold">
          Upcoming features...
        </AlertTitle>
        <AlertDescription className="text-[0.7rem]">
          * Custom URLs and changeable destinations
          <br />* Names for tracking and tags for grouping
        </AlertDescription>
      </Alert> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
          {/* 
            // ~ URL to shorten
          */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <div className="mb-3 flex items-center justify-between text-sm font-semibold">
                  <p className="pt-0.5">URL to shorten</p>
                  <div className="flex items-center gap-4">
                    <Link href="/">
                      <Home className="h-4 w-4" />
                    </Link>
                    <Link
                      href="https://rdt.li/github"
                      target="_blank"
                      className="flex items-center gap-1.5 rounded-md bg-blue-500 px-3 py-0.5 text-[0.6rem] text-white"
                    >
                      <p className="mt-0.5">Github</p>
                      <Star className="h-3.5 w-3.5" />
                    </Link>
                    <Menubar className="h-min rounded-full p-0">
                      <MenubarMenu>
                        <MenubarTrigger className="p-0">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </MenubarTrigger>
                        <MenubarContent className="absolute -right-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <MenubarItem className="flex w-full justify-end text-xs capitalize">
                                Mode: {theme}
                              </MenubarItem>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setTheme('light')}
                              >
                                <Sun className="mr-2 h-4 w-4" />
                                <span className="text-xs">Light</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setTheme('dark')}
                              >
                                <Moon className="mr-2 h-4 w-4" />
                                <span className="text-xs">Dark</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setTheme('system')}
                              >
                                <Laptop className="mr-2 h-4 w-4" />
                                <span className="text-xs">System</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <MenubarSeparator />
                          <MenubarItem
                            className="flex w-full justify-end text-xs"
                            onClick={() => signOut()}
                          >
                            Sign Out
                          </MenubarItem>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  </div>
                </div>
                <FormControl>
                  <Input
                    className="font-mono placeholder:text-slate-400"
                    placeholder="https://github.com/nrjdalal"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription className="text-xs">
                  Enter a valid https URL
                </FormDescription>
              </FormItem>
            )}
          />

          {/* 
            // ~ Advanced options
          */}
          <Accordion type="single" collapsible>
            <AccordionItem className="relative border-none" value="advance">
              <AccordionTrigger className="right-0 -mt-4 mb-5 flex w-full justify-end p-0 font-sans text-xs text-blue-600">
                Advance Settings
                <span className="w-1" />
              </AccordionTrigger>
              <AccordionContent className="overflow-visible pb-1 data-[state=closed]:invisible">
                <div className="space-y-6">
                  {/* 
                  // ~ Title
                */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <FormLabel className="absolute -top-3 left-5 rounded-md bg-background px-3 pt-[3px] text-xs text-foreground/50">
                              Title
                            </FormLabel>
                            <Input
                              className="text-xs placeholder:text-foreground/30"
                              placeholder="e.g. My Github Profile"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="h-4 text-[0.7rem]" />
                      </FormItem>
                    )}
                  />
                  {/* 
                  // ~ Short ID
                */}
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <FormLabel className="absolute -top-3 left-5 rounded-md bg-background px-3 pt-[3px] text-xs text-foreground/50">
                              Short URL
                            </FormLabel>
                            <p className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-foreground/40">
                              {domain}
                            </p>
                            <Input
                              className="text-xs placeholder:text-foreground/30"
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
                            <FormMessage className="h-4 text-[0.7rem]" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button className="w-full font-medium" type="submit">
            Shorten
          </Button>
        </form>
      </Form>

      <ShowUrl />

      <div className="mt-8 flex w-full justify-center">
        <Link href="https://vercel.com" target="_blank">
          <Image
            src="/powered-by-vercel.svg"
            alt="Powered by Vercel"
            height={32}
            width={128}
          />
        </Link>
      </div>
    </div>
  )
}
