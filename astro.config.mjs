// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [
      starlight({
          title: 'PocketbaseExtended',
          description: 'PocketBase REST client library for ESP8266 and ESP32 Arduino boards.',
          social: [
              { icon: 'github', label: 'GitHub', href: 'https://github.com/jeoooo/PocketbaseExtended' },
          ],
          customCss: ['./src/styles/custom.css'],
          components: {
              Search: './src/components/Search.astro',
          },
          sidebar: [
              {
                  label: 'Getting Started',
                  items: [
                      { label: 'Introduction', slug: 'getting-started/introduction' },
                      { label: 'Installation', slug: 'getting-started/installation' },
                      { label: 'Quick Start', slug: 'getting-started/quick-start' },
                      { label: 'Migration from v0.x', slug: 'getting-started/migration' },
                  ],
              },
              {
                  label: 'Guides',
                  items: [
                      { label: 'Authentication', slug: 'guides/authentication' },
                      { label: 'CRUD Records', slug: 'guides/crud-records' },
                      { label: 'Error Handling', slug: 'guides/error-handling' },
                      { label: 'Configuration', slug: 'guides/configuration' },
                  ],
              },
              {
                  label: 'API Reference',
                  items: [
                      { label: 'Client', slug: 'reference/client' },
                      { label: 'Records', slug: 'reference/records' },
                      { label: 'Authentication', slug: 'reference/auth' },
                      { label: 'Configuration', slug: 'reference/configuration' },
                      { label: 'Health & Files', slug: 'reference/health-files' },
                      { label: 'PBResponse', slug: 'reference/pb-response' },
                  ],
              },
              {
                  label: 'AI',
                  items: [
                      { label: 'Using These Docs with AI', slug: 'ai/using-with-ai' },
                      { label: 'llms.txt', link: '/llms.txt' },
                  ],
              },
          ],
      }),
	],

  adapter: cloudflare({
    prerenderEnvironment: 'node',
  }),
});