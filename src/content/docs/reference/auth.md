---
title: Authentication
description: API reference for auth-with-password, token refresh, and token management methods.
---

import { Aside } from '@astrojs/starlight/components';

All auth methods return a [`PBResponse`](/reference/pb-response/). Methods that issue HTTP requests require `.collection()` to be set to the auth collection name (typically `"users"`).

## `authWithPassword()`

Authenticate with an identity (email or username) and password.

```cpp
PBResponse authWithPassword(const char* identity, const char* password);
```

| Parameter | Type | Description |
|---|---|---|
| `identity` | `const char*` | Email address or username of the user. |
| `password` | `const char*` | Account password. |

On success, the JWT is extracted from the response body and stored internally. All subsequent requests automatically include `Authorization: Bearer <token>` until `clearAuthToken()` is called.

PocketBase endpoint: `POST /api/collections/{collection}/auth-with-password`

```cpp
PBResponse auth = pb.collection("users").authWithPassword(
    "user@example.com",
    "yourpassword"
);

if (!auth.ok) {
    Serial.println("Login failed (" + String(auth.statusCode) + "): " + auth.error);
    return;
}

// Token is now stored — all subsequent requests carry it automatically
Serial.println("Token: " + pb.getAuthToken());
```

The response body contains both the token and the full user record:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "record": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "Alice"
  }
}
```

<Aside type="note">
  You do not need to parse the token from the body manually — it is extracted and stored automatically.
</Aside>

---

## `authRefresh()`

Exchange the current token for a new one with a renewed expiry.

```cpp
PBResponse authRefresh();
```

Requires an existing valid token (set via `authWithPassword()` or `setAuthToken()`) and the correct collection to be selected. The new token is stored automatically on success.

PocketBase endpoint: `POST /api/collections/{collection}/auth-refresh`

```cpp
PBResponse refreshed = pb.collection("users").authRefresh();

if (refreshed.ok) {
    Serial.println("Token refreshed");
} else {
    // Token has expired — must log in again
    Serial.println("Refresh failed: " + refreshed.error);
}
```

<Aside type="tip">
  For devices that run for days or weeks without rebooting, call `authRefresh()` periodically (e.g. once per hour) to keep the session alive without re-entering credentials.
</Aside>

---

## `setAuthToken()`

Manually set the auth token — for example, a token restored from flash storage (Preferences, EEPROM) after a reboot.

```cpp
void setAuthToken(const String& token);
```

| Parameter | Type | Description |
|---|---|---|
| `token` | `String` | JWT token string. |

```cpp
// Save to flash after login
String token = pb.getAuthToken();
preferences.putString("pbToken", token);

// Restore on next boot
String saved = preferences.getString("pbToken", "");
if (saved.length() > 0) {
    pb.setAuthToken(saved);
}
```

---

## `getAuthToken()`

Retrieve the currently stored auth token.

```cpp
String getAuthToken() const;
```

Returns an empty `String` when not authenticated.

```cpp
String token = pb.getAuthToken();
if (token.isEmpty()) {
    Serial.println("Not authenticated");
}
```

---

## `clearAuthToken()`

Clear the stored token. Subsequent requests will not include an `Authorization` header.

```cpp
void clearAuthToken();
```

```cpp
pb.clearAuthToken();
Serial.println("Logged out");
```
