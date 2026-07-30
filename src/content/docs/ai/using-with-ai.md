---
title: Using These Docs with AI
description: How to fetch PocketbaseExtended's docs as raw Markdown for LLMs, agents, and AI-assisted coding tools.
---

Every page on this site is also available as raw Markdown, so you can hand it to an LLM, paste it into a prompt, or fetch it from a script or agent.

## Copy Markdown button

Each page has a **Copy Markdown** button next to its title. Click it to copy that page's raw Markdown straight to your clipboard.

## Raw `.md` URLs

Append `.md` to any page's URL to fetch its raw Markdown directly:

```
https://pocketbase-extended-docs.pages.dev/guides/authentication.md
```

This works for every page on the site, so it's easy to `curl` or `fetch()` a specific page from a script, build tool, or agent.

## Full site index — `llms.txt`

A single index of every page, grouped the same way as the sidebar, is published at [`/llms.txt`](/llms.txt). Point an AI tool or agent at this file to give it a map of the whole site.
