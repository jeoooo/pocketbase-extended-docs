---
title: Health & Files
description: API reference for the health check probe and file URL builder.
---

## `checkHealth()`

Probe the PocketBase health endpoint to verify the server is reachable and running.

```cpp
PBResponse checkHealth();
```

Does **not** require a collection to be set. Returns a [`PBResponse`](/reference/pb-response/).

PocketBase endpoint: `GET /api/health`

```cpp
PBResponse health = pb.checkHealth();

if (!health.ok) {
    Serial.println("PocketBase unreachable (status " + String(health.statusCode) + ")");
    // statusCode == 0 means connection failed entirely
    while (true) delay(1000);  // halt
}

Serial.println("Server healthy: " + health.body);
// Body: {"code":200,"message":"API is healthy."}
```

**Typical use** — call `checkHealth()` once at device startup, after WiFi connects, before attempting any record or auth operations:

```cpp
void setup() {
    // ... WiFi connect ...

    PBResponse health = pb.checkHealth();
    if (!health.ok) {
        Serial.println("Cannot reach PocketBase, halting");
        while (true) delay(1000);
    }

    // Proceed with app logic
}
```

---

## `getFileUrl()`

Build the full URL for a file attached to a record. **No HTTP request is made** — this is a pure string-construction helper.

```cpp
String getFileUrl(
    const char* recordId,
    const char* filename,
    const char* thumb = nullptr
);
```

| Parameter | Type | Description |
|---|---|---|
| `recordId` | `const char*` | ID of the record that owns the file. |
| `filename` | `const char*` | Exact filename as stored in the record field (e.g. `"photo_xyz.jpg"`). |
| `thumb` | `const char*` | Optional thumbnail size string, e.g. `"100x100"` or `"0x50"`. Pass `nullptr` for the original file. |

The returned URL follows the PocketBase file path convention:

```
{baseUrl}/api/files/{collection}/{recordId}/{filename}
```

With a `thumb` parameter:

```
{baseUrl}/api/files/{collection}/{recordId}/{filename}?thumb={thumb}
```

```cpp
// Original file
String url = pb.getFileUrl("RECORD_ID", "photo.jpg");
// https://my-pb.com/api/files/avatars/RECORD_ID/photo.jpg

// Thumbnail
String thumb = pb.getFileUrl("RECORD_ID", "photo.jpg", "100x100");
// https://my-pb.com/api/files/avatars/RECORD_ID/photo.jpg?thumb=100x100

// Constrained height, auto width
String tall = pb.getFileUrl("RECORD_ID", "banner.png", "0x200");
// https://my-pb.com/api/files/avatars/RECORD_ID/banner.png?thumb=0x200
```

The active collection set via `.collection()` is used as the collection segment of the URL, so call `.collection()` before `getFileUrl()` if the collection has not already been set.
