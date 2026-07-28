# PocketbaseExtended Docs

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

Documentation site for [PocketbaseExtended](https://github.com/jeoooo/PocketbaseExtended), a PocketBase REST client library for ESP8266 and ESP32 Arduino boards. Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build), and deployed on Cloudflare Pages.

## 🚀 Project Structure

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   └── docs/
│   │       ├── getting-started/
│   │       ├── guides/
│   │       └── reference/
│   └── content.config.ts
├── astro.config.mjs
├── wrangler.jsonc
├── package.json
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in `src/content/docs/`. Each file is exposed as a route based on its file path, and the sidebar structure is defined in `astro.config.mjs`.

Images can be added to `src/assets/` and embedded in Markdown with a relative link. Static assets, like favicons, go in `public/`.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`              | Installs dependencies                            |
| `npm run dev`              | Starts local dev server at `localhost:4321`      |
| `npm run build`            | Builds the production site to `./dist/`          |
| `npm run preview`          | Previews the build locally, before deploying     |
| `npm run astro ...`        | Runs CLI commands like `astro add`, `astro check`|
| `npm run generate-types`   | Generates Cloudflare bindings types via Wrangler  |

## ☁️ Deployment

This site is built with the `@astrojs/cloudflare` adapter and deployed to Cloudflare Pages. It uses Cloudflare Images and Cloudflare KV (for Starlight sessions) as bindings — see `astro.config.mjs` for adapter configuration. Static-page prerendering runs in Node (`prerenderEnvironment: 'node'`) rather than the simulated Workers runtime, since the site is fully static.

## 👀 Want to learn more?

Check out [Starlight's docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or see the main [PocketbaseExtended repo](https://github.com/jeoooo/PocketbaseExtended).
