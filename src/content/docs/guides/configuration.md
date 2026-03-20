---
title: Configuration
description: Configure timeouts, TLS verification, and debug logging.
---

import { Aside } from '@astrojs/starlight/components';

## Timeout

Set how long the library waits for a response before giving up. The default is **10 000 ms** (10 seconds).

```cpp
pb.setTimeout(5000);   // 5 seconds
pb.setTimeout(30000);  // 30 seconds for slow connections
```

Call `setTimeout()` before making requests. It affects all subsequent requests.

## TLS certificate verification

By default, TLS certificate verification is **disabled** (`setInsecureTLS(true)`). This lets you connect to PocketBase instances with self-signed or development certificates without extra setup.

```cpp
pb.setInsecureTLS(true);   // skip verification (default) — for dev / self-signed certs
pb.setInsecureTLS(false);  // verify certificate — for production with a valid cert
```

<Aside type="caution">
  For production deployments where security matters, use a valid TLS certificate and call `pb.setInsecureTLS(false)`. Skipping verification exposes connections to man-in-the-middle attacks.
</Aside>

## Debug logging

Enable verbose output to `Serial` during development:

```cpp
pb.setDebug(true);
```

When enabled, the library prints:
- The full request URL
- The HTTP status code
- The raw response body

Example Serial output:

```
[PB] GET https://my-pb.com/api/collections/notes/records/abc123
[PB] Status: 200
[PB] Body: {"id":"abc123","title":"Hello","created":"2024-01-15 10:30:00.000Z"}
```

<Aside type="tip">
  Always call `pb.setDebug(false)` (or remove the line entirely) before deploying to production. Debug output adds Serial overhead and may expose sensitive data.
</Aside>

## Health check

Use `checkHealth()` as a connectivity probe at device startup — it does not require a collection to be set:

```cpp
PBResponse health = pb.checkHealth();

if (!health.ok) {
    Serial.println("PocketBase unreachable, halting");
    while (true) delay(1000);
}
Serial.println("Server healthy: " + health.body);
// Body: {"code":200,"message":"API is healthy."}
```

## Recommended setup sequence

```cpp
void setup() {
    Serial.begin(115200);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500); Serial.print(".");
    }

    // 1. Configure before first request
    pb.setTimeout(8000);
    pb.setInsecureTLS(true);   // adjust for your server
    pb.setDebug(true);         // remove for production

    // 2. Verify connectivity
    PBResponse health = pb.checkHealth();
    if (!health.ok) {
        Serial.println("Cannot reach PocketBase");
        return;
    }

    // 3. Authenticate (if needed)
    pb.collection("users").authWithPassword("user@example.com", "password");

    // 4. Start your application logic
}
```
