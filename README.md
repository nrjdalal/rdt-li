<a href="https://nextjs.org">
  <h1 align="center">Redirect.link URL Shortener</h1>
</a>

<p align="center">
  Redirect.link is a URL shortener that shortens URL to rdt.li/slug and also tracks number of visits. It is built with Next.js, Drizzle, NextAuth and Postgres.
</p>

<p align="center">
  <a href="https://twitter.com/nrjdalal_com">
    <img src="https://img.shields.io/twitter/follow/nrjdalal_com?style=flat&label=nrjdalal_com&logo=twitter&color=0bf&logoColor=fff" alt="Follow Neeraj on Twitter" />
  </a>
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#roadmap"><strong>Roadmap</strong></a> ·
  <a href="#author"><strong>Author</strong></a> ·
  <a href="#credits"><strong>Credits</strong></a>
</p>

Made via Onset a Next.js starter that comes with step-by-step instructions to understand how everything works, easy for both beginners and experts alike and giving you the confidence to customize it to your needs. Built with Next.js 14, Drizzle (Postgres), NextAuth/Auth.js.

<!-- About: An open source Next.js bare starter with step-by-step instructions if required. Built with Next.js 14, Drizzle (Postgres), NextAuth/Auth.js. -->
<!-- Keywords: drizzle neondb nextauthjs nextjs postgres shadcn tailwindcss typescript vercel -->

## Features

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [Auth.js](https://authjs.dev/) – Handle user authentication with ease with providers like Google, Twitter, GitHub, etc.
- [Drizzle](https://orm.drizzle.team/) – Typescript-first ORM for Node.js

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git
- [Neon](https://neon.tech/) – The fully managed serverless Postgres with a generous free tier

### Installation

Clone & create this repo locally with the following command:

> Note: You can use `npx` or `pnpx` as well

```bash
bunx create-next-app onset-starter --example "https://github.com/nrjdalal/onset"
```

1. Install dependencies using pnpm:

```sh
bun install
```

2. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

3. Run the database migrations:

```sh
bun db:push
```

3. Start the development server:

```sh
bun dev
```

## Deploy

1. Get your Google OAuth credentials at https://console.cloud.google.com/ into your .env
Make sure to add `https://your_url` to "Authorised JavaScript origins" and `https://your_url/api/auth/callback/google` to Authorised redirect URIs
3. Set up Neon account and copy postgres url including `?sslmode=require` into your .env
4. Set up your tables using the SQL Editor on Neon:
```sql
CREATE TABLE "user" (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  "emailVerified" TIMESTAMP,
  image TEXT
);
CREATE TABLE account (
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  scope TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  PRIMARY KEY (provider, "providerAccountId")
);
CREATE TABLE session (
  "sessionToken" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL
);
CREATE TABLE "verificationToken" (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);
CREATE TABLE "shortUrls" (
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  id TEXT NOT NULL PRIMARY KEY,
  url TEXT NOT NULL,
  visits JSON,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);

```
4. Deploy on Vercel

## Roadmap

- [ ] Light and dark mode
- [ ] More features and points to be added

## Author

Created by [@nrjdalal](https://twitter.com/nrjdalal_com) in 2023, released under the [MIT license](https://github.com/nrjdalal/onset/blob/main/LICENSE.md).

## Credits

This project is inspired by [@shadcn](https://twitter.com/shadcn)'s [Taxonomy](https://github.com/shadcn-ui/taxonomy).
