---
title: Introduction
description: Overview of PocketbaseExtended — what it is, what it supports, and how it works.
---

**PocketbaseExtended** is an Arduino library that lets ESP8266 and ESP32 boards talk to a [PocketBase](https://pocketbase.io) backend over HTTP/HTTPS.

It wraps PocketBase's REST API into a concise, chainable interface and returns structured `PBResponse` objects so your sketch can handle success and failure without parsing raw status codes.

## Why PocketbaseExtended?

Most IoT projects that need a backend end up hand-rolling HTTP requests, wrestling with JSON parsing, and duplicating error-handling boilerplate. PocketbaseExtended takes care of all of that:

- **Chainable collection selector** — `pb.collection("notes").getOne("id")`
- **Structured responses** — every method returns `ok`, `statusCode`, `body`, and `error`
- **Auth token management** — login once, every subsequent request carries the token automatically
- **No heavy dependencies** — uses only the platform's built-in WiFi and HTTP stacks

## Supported platforms

| Platform | WiFi / HTTP library used |
|---|---|
| ESP8266 | `ESP8266WiFi` + `ESP8266HTTPClient` |
| ESP32   | `WiFi` + `HTTPClient` + `WiFiClientSecure` |

The correct headers are selected at compile time via `#ifdef` — you do not need to change library code for either board.

## PocketBase compatibility

PocketBase **v0.16 and later**. The library targets the stable REST API surface (`/api/collections`, `/api/health`, `/api/files`).

## Backward compatibility

If you used the previous `PocketbaseArduino` class name, a type alias is provided:

```cpp
using PocketbaseArduino = PocketbaseExtended;
```

Existing sketches compile without any changes.
