---
title: Client
description: PocketbaseExtended constructor and collection selector.
---

`PocketbaseExtended` is the main client class. Create one instance per PocketBase host and reuse it throughout your sketch.

## Constructor

```cpp
explicit PocketbaseExtended(const char* baseUrl);
```

| Parameter | Type | Description |
|---|---|---|
| `baseUrl` | `const char*` | Root URL of the PocketBase instance. Trailing slashes are normalized automatically. |

```cpp
PocketbaseExtended pb("https://my-pb-host.com");
// internally stored as "https://my-pb-host.com/api/"
```

The constructor stores the normalized base URL and sets these defaults:

| Property | Default |
|---|---|
| Timeout | 10 000 ms |
| TLS verification | Skipped (`insecureTLS = true`) |
| Debug logging | Disabled |
| Auth token | Empty (unauthenticated) |

---

## `collection()`

Set the active collection for the next request. Returns `*this` for chaining.

```cpp
PocketbaseExtended& collection(const char* name);
```

| Parameter | Type | Description |
|---|---|---|
| `name` | `const char*` | PocketBase collection name. |

```cpp
pb.collection("notes").getOne("RECORD_ID");
pb.collection("users").authWithPassword("email@example.com", "password");
```

The selector must be called before every record or auth operation. It does not carry over between calls.

---

## Backward compatibility alias

```cpp
using PocketbaseArduino = PocketbaseExtended;
```

Retained for v0.x sketch compatibility. `PocketbaseArduino` is identical to `PocketbaseExtended` — no code changes required.
