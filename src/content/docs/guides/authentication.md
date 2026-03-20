---
title: Authentication
description: Log in with email/password, refresh tokens, and manage auth state on your device.
---

import { Aside } from '@astrojs/starlight/components';

PocketbaseExtended handles the full PocketBase auth lifecycle: login, automatic token storage, authorized requests, token refresh, and logout.

## Login

Call `authWithPassword()` on the auth collection (typically `"users"`). On success, the JWT is extracted from the response and stored internally — all subsequent requests automatically include `Authorization: Bearer <token>`.

```cpp
PBResponse auth = pb.collection("users").authWithPassword(
    "user@example.com",
    "yourpassword"
);

if (!auth.ok) {
    Serial.println("Login failed (" + String(auth.statusCode) + "): " + auth.error);
    return;
}

Serial.println("Logged in. Token: " + pb.getAuthToken());
```

## Authorized requests

Once authenticated, every request carries the token automatically:

```cpp
// No extra setup needed — token is sent automatically
PBResponse resp = pb.collection("private_notes").getListEx("1", "5");

if (resp.ok) {
    Serial.println(resp.body);
} else {
    Serial.println("Fetch failed: " + resp.error);
}
```

## Token refresh

For long-running devices (sensors, displays) that stay powered for days or weeks, use `authRefresh()` to exchange the current token for a new one without re-entering credentials:

```cpp
PBResponse refreshed = pb.collection("users").authRefresh();

if (refreshed.ok) {
    Serial.println("Token refreshed");
} else {
    // Token expired or invalid — must log in again
    Serial.println("Refresh failed: " + refreshed.error);
}
```

<Aside type="note">
  `authRefresh()` requires an existing valid token and the correct collection to be set. If the token has already expired, you must call `authWithPassword()` again.
</Aside>

## Logout

Clear the stored token. Subsequent requests will not include an Authorization header:

```cpp
pb.clearAuthToken();
```

## Manual token management

If you persist the token to flash (e.g. Preferences / EEPROM) between reboots, restore it with `setAuthToken()`:

```cpp
// Save after login
String token = pb.getAuthToken();
// ... write token to storage ...

// Restore on next boot
pb.setAuthToken(savedToken);
```

## Full example

```cpp
#include <PocketbaseExtended.h>
#include <ESP8266WiFi.h>

PocketbaseExtended pb("https://YOUR_POCKETBASE_HOST");

void setup() {
    Serial.begin(115200);
    // ... WiFi connection ...

    // Login
    PBResponse auth = pb.collection("users").authWithPassword(
        "user@example.com", "yourpassword"
    );
    if (!auth.ok) { return; }

    // Authorized read
    PBResponse resp = pb.collection("private_notes").getListEx("1", "5");
    if (resp.ok) Serial.println(resp.body);

    // Create with auth
    PBResponse created = pb.collection("private_notes").createEx(
        "{\"title\":\"Secure note\",\"content\":\"Only visible when logged in\"}"
    );
    Serial.println("Created: " + created.body);

    // Logout
    pb.clearAuthToken();
    Serial.println("Logged out");
}

void loop() {}
```
