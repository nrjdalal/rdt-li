'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn, smallDate } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from 'chart.js'
import {
  ArrowUp,
  BarChart,
  Copy,
  Eye,
  Loader2,
  Pencil,
  Settings,
  Trash,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { toast } from 'sonner'
import { deleteShortUrl, getShortUrls } from './apis/shortUrls'
import EditForm from './editUrl'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const Page = () => {
  const queryClient = useQueryClient()

  const { isPending, isError, data } = useQuery({
    queryKey: ['shortUrls'],
    queryFn: async () => {
      return await getShortUrls()
    },
  })

  const mutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return await deleteShortUrl({
        id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shortUrls'],
      })
    },
  })

  const [sortBy, setSortBy] = useState('createdAt')
  const [filterBy, setFilterBy] = useState('')

  if (isError) {
    return (
      <div className="mt-[92px] flex items-center justify-center">
        <p className="mb-[388px] text-slate-500">Something went wrong</p>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="mt-[92px] flex items-center justify-center">
        <Loader2 className="mb-[388px] animate-spin" />
      </div>
    )
  }

  const getGraphData = (visits: any) => {
    if (!visits) return []

    let data = visits.map((item: any) => [
      item.split('x')[0],
      Number(item.split('x')[1]),
    ])

    data =
      data.length < 7
        ? [...data, ...Array(7 - data.length).fill(['', 0])]
        : data.slice(0, 7)

    return data
  }

  const filtered = data?.filter((item: any) => {
    return (
      item.id.toLowerCase().includes(filterBy.toLowerCase()) ||
      item.url.toLowerCase().includes(filterBy.toLowerCase()) ||
      item.title?.toLowerCase().includes(filterBy.toLowerCase())
    )
  })

  const sortedData = filtered?.sort((a: any, b: any) => {
    if (sortBy === 'updatedAt') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
    if (sortBy === 'views') {
      return (
        getGraphData(b.visits).reduce((a: any, b: any) => a + b[1], 0) -
        getGraphData(a.visits).reduce((a: any, b: any) => a + b[1], 0)
      )
    }
    if (sortBy === 'recentlyVisited') {
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const xData = sortedData.map((item: any) => {
    let id_html = `${process.env.NEXT_PUBLIC_APP_URL?.split('//')[1]}/${
      item.id
    }`.replace(
      new RegExp(filterBy, 'gi'),
      (match: any) => `<span class="bg-yellow-200">${match}</span>`,
    )

    let title_html = item.title?.replace(
      new RegExp(filterBy, 'gi'),
      (match: any) =>
        `<span class="bg-yellow-200 dark:text-black">${match}</span>`,
    )

    let url_html = item.url.replace(
      new RegExp(filterBy, 'gi'),
      (match: any) =>
        `<span class="bg-yellow-200 dark:text-black">${match}</span>`,
    )

    return {
      ...item,
      id_html,
      url_html,
      title_html,
    }
  })

  return (
    <>
      <div className="mb-4 mt-24 flex h-8 items-center justify-between text-xs">
        {data.length ? (
          <>
            <Input
              className="h-8 w-40 text-xs sm:w-80"
              placeholder="Search"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            />
            <p className="text-center font-sans text-[0.7rem]">
              URLs:<span className="ml-1">{xData.length}</span>
            </p>
            <Select
              onValueChange={(value: any) => {
                setSortBy(value)
              }}
            >
              <SelectTrigger className="h-8 w-40 text-[0.65rem]">
                <SelectValue defaultValue={sortBy} placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="absolute -right-40 w-max">
                <SelectItem className="text-[0.7rem]" value="createdAt">
                  Created At
                </SelectItem>
                <SelectItem className="text-[0.7rem]" value="updatedAt">
                  Updated At
                </SelectItem>
                <SelectItem className="text-[0.7rem]" value="views">
                  Views
                </SelectItem>
                <SelectItem className="text-[0.7rem]" value="recentlyVisited">
                  Recently Visited
                </SelectItem>
              </SelectContent>
            </Select>
          </>
        ) : (
          <p className="w-full text-center text-xs">No Links Shortened</p>
        )}
      </div>

      <div
        className={cn(
          'flex flex-col space-y-3',
          !xData.length && 'mt-[470px]',
          xData.length === 1 && 'mb-[396px]',
          xData.length === 2 && 'mb-[310px]',
          xData.length === 3 && 'mb-[224px]',
          xData.length === 4 && 'mb-[138px]',
          xData.length === 5 && 'mb-[52px]',
          xData.length > 5 && 'mb-20',
        )}
      >
        {xData.map(
          (shortUrl: {
            id: string
            url: string
            title: any
            visits: any
            lastVisit: any
            id_html: string
            url_html: string
            title_html: string
          }) => (
            <div
              className="flex flex-col space-y-1.5 rounded-md border bg-background p-3 text-sm"
              key={shortUrl.id}
            >
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-1 px-2">
                    {shortUrl?.visits?.length ? (
                      <>
                        <ArrowUp className="h-3 w-3 text-green-500" />
                        <p className="flex text-green-500">
                          {smallDate() === shortUrl.visits[0].split('x')[0]
                            ? shortUrl.visits[0].split('x')[1]
                            : 0}
                        </p>
                      </>
                    ) : (
                      ''
                    )}
                    <Eye className="h-3 w-3 text-foreground" />
                    <p className="pt-px">
                      {shortUrl?.visits?.length
                        ? getGraphData(shortUrl.visits).reduce(
                            (a: any, b: any) => a + b[1],
                            0,
                          )
                        : 0}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 p-1 px-2 text-[0.6rem]">
                    <Link
                      className="text-black"
                      href={`/${shortUrl.id}`}
                      target="_blank"
                      dangerouslySetInnerHTML={{
                        __html: shortUrl.id_html,
                      }}
                    />
                    <div className="h-1 w-1 rounded-full bg-slate-500/30" />
                    <Copy
                      className="h-3.5 w-3.5 cursor-pointer text-slate-500"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${process.env.NEXT_PUBLIC_APP_URL}/${shortUrl.id}`,
                        )
                        toast.success('Copied to clipboard')
                      }}
                    />

                    <div className="h-1 w-1 rounded-full bg-slate-500/30" />

                    <Menubar className="relative h-min rounded-full border-none p-0">
                      <MenubarMenu>
                        <MenubarTrigger className="bg-blue-50 p-0 focus:bg-blue-50 data-[state=open]:bg-blue-50">
                          <Settings className="h-3.5 w-3.5 cursor-pointer text-blue-600" />
                        </MenubarTrigger>
                        <MenubarContent className="absolute -right-[35px] top-0.5">
                          <EditForm
                            id={shortUrl.id}
                            title={shortUrl.title}
                            url={shortUrl.url}
                          />

                          <MenubarSeparator />

                          <AlertDialog>
                            <AlertDialogTrigger className="flex h-full w-full items-center justify-between rounded-sm p-1 px-2 text-[0.675rem]">
                              <p className="text-foreground/80">Delete</p>
                              <Trash className="h-3 w-3 text-foreground/80" />
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-11/12 rounded-md font-mono">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-sm">
                                  Do you want to delete
                                  <br />
                                  {
                                    process.env.NEXT_PUBLIC_APP_URL?.split(
                                      '//',
                                    )[1]
                                  }
                                  /{shortUrl.id}?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="line-clamp-2 break-all text-xs">
                                  URL: {shortUrl.url}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex gap-2">
                                <AlertDialogCancel className="px-8 text-xs">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 px-8 text-xs text-white"
                                  onClick={() => {
                                    mutation.mutate({ id: shortUrl.id })
                                    toast.info('Deleted')
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  </div>
                </div>
                {shortUrl.title && (
                  <p
                    className="-mb-1 mt-0.5 text-[0.65rem] font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: shortUrl.title_html,
                    }}
                  />
                )}
                <p
                  className="mt-0.5 line-clamp-2 break-all text-[0.65rem] text-foreground/70"
                  dangerouslySetInnerHTML={{
                    __html: shortUrl.url_html,
                  }}
                />
              </div>

              <Accordion
                className={cn(shortUrl?.visits?.length ? 'block' : 'hidden')}
                type="single"
                collapsible
              >
                <AccordionItem className="!border-b-0" value="item-1">
                  <AccordionTrigger className="py-0 text-foreground/70">
                    <p className="flex items-center gap-2 font-sans text-[0.6rem] font-light text-foreground/70">
                      <BarChart className="h-3 w-3" />{' '}
                      {shortUrl?.lastVisit && (
                        <span>
                          Last visited:{' '}
                          {new Date(shortUrl?.lastVisit).toLocaleString()}
                        </span>
                      )}
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <Bar
                      data={{
                        labels: getGraphData(shortUrl.visits)
                          .reverse()
                          .map((item: any) => {
                            return item[0]
                              ? `${item[0].slice(4, 6)}-${item[0].slice(
                                  2,
                                  4,
                                )}-${item[0].slice(0, 2)}`
                              : ''
                          }),
                        datasets: [
                          {
                            label: 'Visits',
                            data: getGraphData(shortUrl.visits)
                              .reverse()
                              .map((item: any) => item[1]),
                            backgroundColor: '#f43f5e',
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        scales: {
                          y: {
                            beginAtZero: true,
                            position: 'right',
                          },
                        },
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ),
        )}
      </div>
    </>
  )
}

export default Page
