import { headers as Headers } from 'next/headers'

const Page = () => {
  let headers: any = Headers()
  headers = Array.from(headers.entries())
  headers = {
    city: headers['x-vercel-ip-city'],
    country: headers['x-vercel-ip-country'],
    'country-region': headers['x-vercel-ip-country-region'],
    host: headers['host'] || headers['x-forwarded-host'],
    ip:
      headers['x-forwarded-for'] ||
      headers['x-vercel-forwarded-for'] ||
      headers['x-real-ip'] ||
      headers['x-vercel-proxied-for'],
    mobile: headers['sec-ch-ua-mobile'],
    platform: headers['sec-ch-ua-platform'],
    referer: headers['referer'],
    timezone: headers['x-vercel-ip-timezone'],
    'user-agent': headers['user-agent'],
  }

  return (
    <>
      <div className="w-full border-b-2 p-5 text-center text-xs">
        {headers.map((header: any, key: number) => {
          return (
            <div key={key}>
              <span className="font-bold">{key + 1 + ' ' + header[0]}: </span>
              <span className="font-light">{header[1]}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Page
