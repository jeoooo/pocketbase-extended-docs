---
title: Records
description: API reference for all record read, create, update, and delete methods.
---

import { Aside } from '@astrojs/starlight/components';

All record methods require a collection to be selected first via [`.collection()`](/reference/client/). Every `Ex` method returns a [`PBResponse`](/reference/pb-response/); the convenience variants return only the raw body `String`.

## Extended methods

### `getOneEx()`

Fetch a single record by ID.

```cpp
PBResponse getOneEx(
    const char* recordId,
    const char* expand = nullptr,
    const char* fields = nullptr
);
```

| Parameter | Type | Description |
|---|---|---|
| `recordId` | `const char*` | ID of the record. Must not be empty. |
| `expand` | `const char*` | Comma-separated relation fields to expand, e.g. `"author,tags"`. `nullptr` to skip. |
| `fields` | `const char*` | Comma-separated fields to include in the response, e.g. `"id,title"`. `nullptr` for all fields. |

PocketBase endpoint: `GET /api/collections/{collection}/records/{id}`

```cpp
PBResponse resp = pb.collection("posts").getOneEx(
    "RECORD_ID",
    "author",      // expand the author relation
    "id,title,body" // return only these fields
);
if (resp.ok) Serial.println(resp.body);
```

---

### `getListEx()`

Fetch a paginated list of records. All parameters are optional — pass `nullptr` to use the server default.

```cpp
PBResponse getListEx(
    const char* page      = nullptr,
    const char* perPage   = nullptr,
    const char* sort      = nullptr,
    const char* filter    = nullptr,
    const char* skipTotal = nullptr,
    const char* expand    = nullptr,
    const char* fields    = nullptr
);
```

| Parameter | Default | Description |
|---|---|---|
| `page` | `1` | Page number (1-based). |
| `perPage` | `30` | Records per page (max 500). |
| `sort` | — | Sort expression. Prefix with `-` for DESC, e.g. `"-created,id"`. |
| `filter` | — | PocketBase filter expression, e.g. `"active = true && views > 100"`. |
| `skipTotal` | — | Pass `"1"` to omit `totalItems`/`totalPages` for faster queries. |
| `expand` | — | Comma-separated relation fields to expand. |
| `fields` | — | Comma-separated fields to include in each record. |

PocketBase endpoint: `GET /api/collections/{collection}/records`

```cpp
// Page 1, newest 10, only active records
PBResponse resp = pb.collection("notes").getListEx(
    "1", "10", "-created",
    "active = true",
    nullptr, nullptr, nullptr
);

// Fast query — skip total count
PBResponse fast = pb.collection("logs").getListEx(
    "1", "50", "-created",
    nullptr, "1",  // skipTotal = "1"
    nullptr, nullptr
);
```

**Sort syntax**

| Expression | Result |
|---|---|
| `"created"` | Oldest first (ASC) |
| `"-created"` | Newest first (DESC) |
| `"-views,title"` | Most viewed, then alphabetical |

**Filter examples**

```
active = true
active = true && views > 100
title ~ 'hello'
created >= '2024-01-01'
```

---

### `createEx()`

Create a new record.

```cpp
PBResponse createEx(const String& requestBody);
```

| Parameter | Type | Description |
|---|---|---|
| `requestBody` | `String` | JSON string of the fields to set. |

PocketBase endpoint: `POST /api/collections/{collection}/records`

```cpp
PBResponse resp = pb.collection("notes").createEx(
    "{\"title\":\"Hello from ESP\",\"active\":true}"
);
if (resp.ok) Serial.println("New id: " + resp.body);
```

---

### `updateEx()`

Partially update an existing record. Only the fields present in `requestBody` are changed — omitted fields retain their current values (PATCH semantics).

```cpp
PBResponse updateEx(const char* recordId, const String& requestBody);
```

| Parameter | Type | Description |
|---|---|---|
| `recordId` | `const char*` | ID of the record to update. Must not be empty. |
| `requestBody` | `String` | JSON string of fields to update. |

PocketBase endpoint: `PATCH /api/collections/{collection}/records/{id}`

```cpp
PBResponse resp = pb.collection("notes").updateEx(
    "RECORD_ID",
    "{\"title\":\"Updated title\"}"
);
```

---

### `deleteRecordEx()`

Delete a record by ID.

```cpp
PBResponse deleteRecordEx(const char* recordId);
```

| Parameter | Type | Description |
|---|---|---|
| `recordId` | `const char*` | ID of the record to delete. Must not be empty. |

A successful delete returns HTTP 204 with an empty body. `PBResponse::ok` is `true` and `body` is empty.

PocketBase endpoint: `DELETE /api/collections/{collection}/records/{id}`

```cpp
PBResponse resp = pb.collection("notes").deleteRecordEx("RECORD_ID");
if (resp.ok) Serial.println("Deleted");
```

---

## Convenience methods

Wrappers around the `Ex` methods that return only the raw body `String`. Return an empty string on failure.

<Aside type="note">
  Use the `Ex` variants for any code path that needs to detect errors. Convenience methods are suitable for simple data dumps or fire-and-forget writes where failure is acceptable.
</Aside>

```cpp
String getOne(const char* recordId,
              const char* expand = nullptr,
              const char* fields = nullptr);

String getList(const char* page      = nullptr,
               const char* perPage   = nullptr,
               const char* sort      = nullptr,
               const char* filter    = nullptr,
               const char* skipTotal = nullptr,
               const char* expand    = nullptr,
               const char* fields    = nullptr);

String create(const String& requestBody);

String update(const char* recordId, const String& requestBody);

String deleteRecord(const char* recordId);
```

```cpp
// Quick read — no error handling needed
String body = pb.collection("notes").getOne("RECORD_ID");
Serial.println(body);

// Quick create — log and continue
pb.collection("events").create("{\"type\":\"boot\"}");
```
