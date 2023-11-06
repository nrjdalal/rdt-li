<blockquote align="center"><h4>News (Coming Soon)</h4></blockquote>
<blockquote align="center"> • API v1 for programmatic use </blockquote>
<blockquote align="center"> • Ability to add name for links identification </blockquote>
<blockquote align="center"> • Ability to change short or redirect links </blockquote>

<a href="https://nextjs.org">
  <h1 align="center">
   <a href="https://rdt.li/m5NksJ" tardet="_blank">
    Redirect.link
   </a>
   URL Shortener
  </h1>
</a>

<p align="center">
  <a href="https://rdt.li/m5NksJ" tardet="_blank">Redirect.link</a> is a URL shortener that shortens URL to rdt.li/slug and also tracks number of visits. It is built with Next.js, Drizzle, NextAuth and Postgres.
</p>

<p align="center"><a href="https://rdt.li/m5NksJ" tardet="_blank">Try now</a> or <a href="#one-click-deploy">self host</a> it.</p>

<p align="center">
  <a href="https://rdt.li/lNB90I">
    <img src="https://img.shields.io/twitter/follow/nrjdalal_com?style=flat&label=nrjdalal_com&logo=twitter&color=0bf&logoColor=fff" alt="Follow Neeraj on Twitter" />
  </a>
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#one-click-deploy"><strong>Deploy</strong></a> ·
  <a href="#local-development"><strong>Development</strong></a> ·
  <a href="#roadmap"><strong>Roadmap</strong></a> ·
  <a href="#author"><strong>Author</strong></a> ·
  <a href="#credits"><strong>Credits</strong></a>
</p>

<a align="center" href="https://rdt.li/m5NksJ" target="_black">
  <img src="/public/demo.jpeg" alt="rdt.li dashboard example"/>
</a>

<!-- About: An open source Next.js bare starter with step-by-step instructions if required. Built with Next.js 14, Drizzle (Postgres), NextAuth/Auth.js. -->
<!-- Keywords: drizzle neondb nextauthjs nextjs postgres shadcn tailwindcss typescript vercel -->

## Features

Made via [Onset](https://onset.vercel.app) a Next.js starter that comes with step-by-step instructions to understand how everything works, easy for both beginners and experts alike and giving you the confidence to customize it to your needs. Built with Next.js 14, Drizzle (Postgres), NextAuth/Auth.js.

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [Auth.js](https://authjs.dev/) – Handle user authentication with ease with providers like Google, Twitter, GitHub, etc.
- [Drizzle](https://orm.drizzle.team/) – Typescript-first ORM for Node.js

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git
- [Neon](https://neon.tech/) – The fully managed serverless Postgres with a generous free tier

## One Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnrjdalal%2Frdt-li&env=POSTGRES_URL,NEXTAUTH_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,NEXT_PUBLIC_APP_URL&project-name=rdt-li-by-nrjdalal&repository-name=rdt-li-by-nrjdalal)

## Local Development

Clone & create this repo locally with the following command:

> Note: You can use `npx` or `pnpx` as well

```bash
bunx create-next-app rdt-li --example "https://github.com/nrjdalal/rdt-li"
```

1. Install dependencies using bun:

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

## Roadmap

- [ ] Light and dark mode
- [ ] More features and points to be added

## Author

Created by [@nrjdalal](https://twitter.com/nrjdalal_com) in 2023, released under the [MIT license](https://github.com/nrjdalal/onset/blob/main/LICENSE.md).

## Credits

This project is inspired by [@shadcn](https://twitter.com/shadcn)'s [Taxonomy](https://github.com/shadcn-ui/taxonomy).

[![Vercel](https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg)](https://vercel.com)
