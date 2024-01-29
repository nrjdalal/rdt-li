import { db } from '@/lib/db'
import { shortUrls, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

const decryptor = async (text: string) => {
  const user = await db
    .select({
      id: users.id,
      apiKeySalt: users.apiKeySalt,
    })
    .from(users)
    .where(eq(users.apiKey, text.slice(0, 32)))

  if (!user.length) return false

  const encodedSalt = new TextEncoder().encode(user[0].apiKeySalt as string)
  const encodedKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)

  const importedKey = await crypto.subtle.importKey(
    'raw',
    encodedSalt,
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  )

  const encryptedText = atob(text)
  const encryptedBuffer = new Uint8Array(
    encryptedText.split('').map((char) => char.charCodeAt(0)),
  ) as any

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: encodedKey,
    },
    importedKey,
    encryptedBuffer,
  )

  const decryptedString = new TextDecoder().decode(decrypted)

  if (decryptedString === user[0].id + '.' + user[0].apiKeySalt) {
    return {
      id: user[0].id,
    }
  }

  return false
}

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('Authorization')?.split(' ')[1]

    const isMatch = await decryptor(apiKey as string)

    if (isMatch) {
      // get short urls
      const shortUrlsData = await db
        .select()
        .from(shortUrls)
        .where(eq(shortUrls.userId, isMatch.id))

      return NextResponse.json({
        data: shortUrlsData,
        status: 200,
      })

      // create short url ...
      // update short url ...
    }

    return NextResponse.json({ message: 'User does not exist', status: 404 })
  } catch {
    return NextResponse.json({ message: 'Please try again', status: 409 })
  }
}
