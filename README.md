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

## Roadmap

- [ ] Light and dark mode
- [ ] More features and points to be added

## Author

Created by [@nrjdalal](https://twitter.com/nrjdalal_com) in 2023, released under the [MIT license](https://github.com/nrjdalal/onset/blob/main/LICENSE.md).

## Credits

This project is inspired by [@shadcn](https://twitter.com/shadcn)'s [Taxonomy](https://github.com/shadcn-ui/taxonomy).

![Vercel](https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg)
