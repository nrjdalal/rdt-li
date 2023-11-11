import { headers as Headers } from 'next/headers'

const Page = () => {
  let headers: any = Headers()
  headers = Array.from(headers.entries())

  return (
    <>
      <div className="w-full border-b-2 p-5 text-center text-xs">
        {headers.map((header: any, key: number) => {
          return (
            <div key={key}>
              <span className="font-bold">{header[0]}: </span>
              <span className="font-light">{header[1]}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Page
