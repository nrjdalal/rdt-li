import { headers as Headers } from 'next/headers'

const Page = () => {
  let headers: any = Headers()
  headers = headers.headers

  headers = [
    ['city', headers['x-vercel-ip-city']],
    ['country', headers['x-vercel-ip-country']],
    ['country-region', headers['x-vercel-ip-country-region']],
    ['timezone', headers['x-vercel-ip-timezone']],
    ['referer', headers['referer']],
    ['host', headers['host'] || headers['x-forwarded-host']],
    [
      'ip',
      headers['x-forwarded-for'] ||
        headers['x-vercel-forwarded-for'] ||
        headers['x-real-ip'] ||
        headers['x-vercel-proxied-for'],
    ],
    ['mobile', headers['sec-ch-ua-mobile']],
    ['platform', headers['sec-ch-ua-platform']],
    ['user-agent', headers['user-agent']],
  ]

  return (
    <>
      <div className="container w-full border-b-2 p-5 text-center">
        {headers.map((header: any, key: number) => {
          return (
            header[1] && (
              <div className="mb-1.5 flex flex-col gap-1" key={key}>
                <div className="rounded-md bg-foreground p-[0.2rem] px-2 text-[0.65rem] font-light text-background">
                  <p className="font-bold">{header[0]}</p>
                  {header[1]}
                </div>
              </div>
            )
          )
        })}
      </div>
    </>
  )
}

export default Page
