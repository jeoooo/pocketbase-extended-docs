---
title: PBResponse
description: The structured response type returned by all Ex methods.
---

`PBResponse` is a plain struct returned by every `Ex` method. It gives you all the information you need to handle both success and failure without parsing raw HTTP status codes yourself.

## Definition

```cpp
struct PBResponse {
    bool   ok;          // true when the HTTP status is 2xx
    int    statusCode;  // HTTP status code; 0 when the connection itself failed
    String body;        // Raw JSON response body
    String error;       // Human-readable error; equals body on 4xx/5xx
};
```

## Fields

### `ok`

`true` when the HTTP status code is in the 2xx range (200–299). This is the primary field to check after any request.

```cpp
PBResponse resp = pb.collection("notes").getOneEx("id");
if (resp.ok) {
    // success
}
```

---

### `statusCode`

The raw HTTP status code returned by the server.

| Value | Meaning |
|---|---|
| `0` | Connection failed (no response received) |
| `200` | OK |
| `204` | No Content (successful delete) |
| `400` | Bad Request |
| `401` | Unauthorized (missing or expired token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `500` | Internal Server Error |

```cpp
if (resp.statusCode == 0) {
    Serial.println("Connection failed — check WiFi and host URL");
}
```

---

### `body`

The raw JSON response body as a `String`. On a successful delete (HTTP 204), `body` is empty.

```cpp
Serial.println(resp.body);
// {"id":"abc123","title":"Hello","created":"2024-01-15 10:30:00.000Z"}
```

---

### `error`

A human-readable error description. On 4xx/5xx responses this equals `body` (the raw PocketBase error JSON). On connection failures (statusCode 0) it contains a short description.

```cpp
if (!resp.ok) {
    Serial.println(resp.error);
    // e.g.: {"code":404,"message":"The requested resource wasn't found.","data":{}}
}
```

## Usage patterns

### Simple check

```cpp
PBResponse resp = pb.collection("notes").createEx("{\"title\":\"Test\"}");

if (resp.ok) {
    Serial.println("Created: " + resp.body);
} else {
    Serial.println("Failed: " + resp.error);
}
```

### Full error discrimination

```cpp
PBResponse resp = pb.collection("notes").getOneEx("RECORD_ID");

if (resp.ok) {
    Serial.println(resp.body);
} else if (resp.statusCode == 0) {
    Serial.println("No connection");
} else if (resp.statusCode == 401) {
    Serial.println("Not authenticated");
} else if (resp.statusCode == 404) {
    Serial.println("Record not found");
} else {
    Serial.print("HTTP "); Serial.println(resp.statusCode);
    Serial.println(resp.error);
}
```

### Auth response

The auth response body contains both the `token` and the `record` object:

```cpp
PBResponse auth = pb.collection("users").authWithPassword("email", "pw");

if (auth.ok) {
    // auth.body contains: {"token":"...", "record":{"id":"...", ...}}
    // The token is automatically extracted and stored — no manual parsing needed.
    Serial.println("Token: " + pb.getAuthToken());
}
```
