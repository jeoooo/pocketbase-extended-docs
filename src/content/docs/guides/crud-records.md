---
title: CRUD Records
description: Create, read, update, and delete PocketBase records from your Arduino sketch.
---

import { Aside, Badge } from '@astrojs/starlight/components';

All record operations require a collection to be selected first via `.collection("name")`. The selector is chainable and sets the active collection for the immediately following call.

## Two API flavors

Every operation has two variants:

| Variant | Returns | Use when |
|---|---|---|
| `Ex` methods (e.g. `getOneEx`) | `PBResponse` | You need `ok`, `statusCode`, or `error` |
| Convenience methods (e.g. `getOne`) | `String` (body) | You only need the raw JSON body |

## Get one record

```cpp
// Convenience — returns raw JSON body
String body = pb.collection("notes").getOne("RECORD_ID");

// Extended — returns PBResponse
PBResponse resp = pb.collection("notes").getOneEx("RECORD_ID");
if (resp.ok) {
    Serial.println(resp.body);
} else {
    Serial.println("Error " + String(resp.statusCode) + ": " + resp.error);
}
```

### Optional parameters

```cpp
PBResponse resp = pb.collection("posts").getOneEx(
    "RECORD_ID",
    "author,tags",   // expand: auto-expand relation fields
    "id,title,body"  // fields: return only these fields
);
```

Pass `nullptr` to omit a parameter and use the server default.

## Get a list

```cpp
PBResponse resp = pb.collection("notes").getListEx(
    "1",        // page (1-based)
    "10",       // perPage (max 500)
    "-created", // sort: newest first; omit prefix for ASC
    nullptr,    // filter
    nullptr,    // skipTotal
    nullptr,    // expand
    nullptr     // fields
);
```

### Sorting

Prefix a field name with `-` for descending order:

```cpp
"-created"        // newest first
"created"         // oldest first
"-views,title"    // most viewed, then alphabetical
```

### Filtering

PocketBase filter expressions:

```cpp
"active = true"
"active = true && views > 100"
"title ~ 'hello'"        // contains
"created >= '2024-01-01'"
```

### Skipping the total count

Set `skipTotal` to `"1"` for faster queries when you don't need `totalItems` / `totalPages`:

```cpp
PBResponse resp = pb.collection("notes").getListEx(
    "1", "30", "-created",
    nullptr, "1",  // skipTotal = 1
    nullptr, nullptr
);
```

## Create a record

Pass a JSON string of the fields to set:

```cpp
PBResponse resp = pb.collection("notes").createEx(
    "{\"title\":\"Hello\",\"active\":true}"
);

if (resp.ok) {
    Serial.println("Created with id: " + resp.body);
}
```

<Aside type="tip">
  If you need to build JSON dynamically, use `String` concatenation or the ArduinoJson library to construct the body before passing it to `createEx()`.
</Aside>

## Update a record

Only the fields present in the body are changed (PATCH semantics):

```cpp
PBResponse resp = pb.collection("notes").updateEx(
    "RECORD_ID",
    "{\"title\":\"Updated title\"}"
);
```

Omitted fields retain their current server-side values.

## Delete a record

```cpp
PBResponse resp = pb.collection("notes").deleteRecordEx("RECORD_ID");

if (resp.ok) {
    // HTTP 204 — body is empty
    Serial.println("Deleted successfully");
} else {
    Serial.println("Delete failed: " + resp.error);
}
```

<Aside type="note">
  A successful delete returns HTTP 204 with an empty body. `resp.ok` will be `true` and `resp.body` will be an empty string.
</Aside>

## File URL

Build the URL for a file attached to a record — no HTTP request is made:

```cpp
String url = pb.getFileUrl(
    "RECORD_ID",
    "photo.jpg",
    "100x100"    // optional thumbnail size; pass nullptr for original
);
Serial.println(url);
// https://YOUR_HOST/api/files/COLLECTION/RECORD_ID/photo.jpg?thumb=100x100
```
