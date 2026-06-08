---
title: Migration from v0.x
description: What changed between PocketbaseArduino v0.x and PocketbaseExtended v1.0, and how to update your sketches.
---

import { Aside } from '@astrojs/starlight/components';

PocketbaseExtended v1.0 is a superset of the old `PocketbaseArduino` library. Existing sketches compile without changes — but there are several fixes and new capabilities worth adopting.

## Breaking changes

There are **no breaking changes**. All v0.x method names still work.

## What changed

| v0.x | v1.0 |
|---|---|
| `PocketbaseArduino pb(...)` | `PocketbaseExtended pb(...)` — `PocketbaseArduino` still compiles as a typedef alias |
| `#include <BearSSLHelpers.h>` in sketch | No longer needed — included internally |
| `#include <ESP8266HTTPClient.h>` in sketch | No longer needed — included internally |
| `getList` wrote `skipTotal=<filter>` instead of `filter=<filter>` (bug) | Fixed — all query params map correctly |
| No `update()` | `update()` / `updateEx()` added |
| No authentication | `authWithPassword()`, `authRefresh()`, `setAuthToken()`, `clearAuthToken()` added |
| All errors returned empty string | `PBResponse` struct with `ok`, `statusCode`, `body`, and `error` |
| Debug logging always on | Off by default; enable with `pb.setDebug(true)` |

## Adopting PBResponse

The biggest improvement is structured error handling. Where v0.x returned an empty string on failure:

```cpp
// v0.x — no way to tell success from failure
String body = pb.collection("notes").getList("1", "10");
if (body == "") {
  // error? or just an empty list?
}
```

v1.0 has `Ex` variants that return a `PBResponse`:

```cpp
// v1.0 — explicit, unambiguous
PBResponse resp = pb.collection("notes").getListEx("1", "10");
if (resp.ok) {
  Serial.println(resp.body);
} else {
  Serial.println("HTTP " + String(resp.statusCode) + ": " + resp.error);
}
```

The original `getList`, `getOne`, `create`, `update`, and `deleteRecord` methods are still present and return `String`, so migration can be done incrementally.

## Removing manual includes

If your sketch includes these lines, they can be removed:

```cpp
// These are now handled inside the library — safe to delete from your sketch
#include <BearSSLHelpers.h>
#include <ESP8266HTTPClient.h>
```

Keep only the platform WiFi include and `PocketbaseExtended.h`:

```cpp
#include <PocketbaseExtended.h>
#include <ESP8266WiFi.h>   // or <WiFi.h> for ESP32
```

<Aside type="tip">
  The class name alias means you can rename `PocketbaseArduino` to `PocketbaseExtended` at your own pace — or never, if you prefer. Both names refer to the same class.
</Aside>
