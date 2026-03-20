---
title: Configuration
description: API reference for timeout, TLS, and debug logging settings.
---

import { Aside } from '@astrojs/starlight/components';

Configuration methods can be called at any time, but are typically set once during `setup()` before any requests are made.

## `setTimeout()`

Set the HTTP request timeout.

```cpp
void setTimeout(uint32_t ms);
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `ms` | `uint32_t` | `10000` | Timeout in milliseconds. |

```cpp
pb.setTimeout(5000);   // 5 s — for fast local networks
pb.setTimeout(30000);  // 30 s — for slow or congested connections
```

When the timeout is reached without a response, `_request()` returns a `PBResponse` with `ok = false` and `statusCode = 0`.

---

## `setInsecureTLS()`

Enable or disable TLS certificate verification.

```cpp
void setInsecureTLS(bool enabled);
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `enabled` | `bool` | `true` | `true` skips verification; `false` enforces it. |

```cpp
pb.setInsecureTLS(true);   // skip — for self-signed / dev certificates (default)
pb.setInsecureTLS(false);  // verify — for production with a valid certificate
```

<Aside type="caution">
  Skipping TLS verification exposes connections to man-in-the-middle attacks. Use `setInsecureTLS(false)` in any deployment where the data or credentials are sensitive, and ensure your PocketBase instance has a valid certificate.
</Aside>

---

## `setDebug()`

Enable or disable verbose debug logging to `Serial`.

```cpp
void setDebug(bool enabled);
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `enabled` | `bool` | `false` | `true` prints request details to Serial. |

When enabled, the library prints:

- Full request URL
- HTTP status code
- Raw response body

```
[PB] GET https://my-pb.com/api/collections/notes/records/abc123
[PB] Status: 200
[PB] Body: {"id":"abc123","title":"Hello","created":"2024-01-15 10:30:00.000Z"}
```

```cpp
pb.setDebug(true);   // enable during development
pb.setDebug(false);  // disable for production
```

<Aside type="tip">
  Add `pb.setDebug(true)` at the top of `setup()` while developing, and remove the line (or set it to `false`) before deploying to production. Debug output adds Serial overhead and will expose request bodies and auth tokens to Serial monitors.
</Aside>
