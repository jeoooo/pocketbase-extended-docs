---
title: Error Handling
description: Use PBResponse to handle success and failure correctly in your sketches.
---

import { Aside } from '@astrojs/starlight/components';

Every `Ex` method returns a `PBResponse` struct that gives you full visibility into what happened.

## The PBResponse struct

```cpp
struct PBResponse {
    bool   ok;          // true when HTTP status is 2xx
    int    statusCode;  // HTTP status code; 0 if the connection failed
    String body;        // Raw JSON response body
    String error;       // Human-readable error; equals body on 4xx/5xx
};
```

## Basic success/failure check

```cpp
PBResponse resp = pb.collection("notes").getOneEx("RECORD_ID");

if (resp.ok) {
    Serial.println(resp.body);
} else {
    Serial.println("Failed: " + resp.error);
}
```

## Distinguishing error types

```cpp
PBResponse resp = pb.collection("notes").getOneEx("RECORD_ID");

if (resp.ok) {
    // 2xx
    Serial.println(resp.body);
} else if (resp.statusCode == 0) {
    // Connection failure — WiFi issue, wrong host, DNS failure
    Serial.println("Connection failed");
} else if (resp.statusCode == 401) {
    Serial.println("Unauthorized — token missing or expired");
} else if (resp.statusCode == 403) {
    Serial.println("Forbidden — insufficient permissions");
} else if (resp.statusCode == 404) {
    Serial.println("Record not found");
} else {
    Serial.print("HTTP error ");
    Serial.println(resp.statusCode);
    Serial.println(resp.error);  // raw PocketBase error JSON
}
```

## Auth failures

```cpp
PBResponse auth = pb.collection("users").authWithPassword(
    "user@example.com", "wrongpassword"
);

if (!auth.ok) {
    Serial.println("Login failed (" + String(auth.statusCode) + "): " + auth.error);
    // e.g.: Login failed (400): {"code":400,"message":"Failed to authenticate.","data":{}}
    return;
}
```

## Connection failures

When the device cannot reach the server at all, `statusCode` is `0`:

```cpp
PBResponse resp = pb.checkHealth();

if (resp.statusCode == 0) {
    Serial.println("Cannot reach PocketBase — check WiFi and host URL");
} else if (resp.ok) {
    Serial.println("Server is healthy");
}
```

## Convenience vs Extended methods

The convenience methods (`getOne`, `getList`, `create`, `update`, `deleteRecord`) return only the raw body `String`. They return an empty string on failure, which is indistinguishable from a valid empty response.

Use the `Ex` variants whenever you need to act on errors:

```cpp
// OK for fire-and-forget logging where errors are acceptable
pb.collection("events").create("{\"type\":\"boot\"}");

// Correct for anything that must succeed
PBResponse resp = pb.collection("settings").getOneEx("DEVICE_CONFIG");
if (!resp.ok) {
    // Handle missing config
}
```

<Aside type="caution">
  Do not rely on an empty `body` string to detect errors from convenience methods. Always use the `Ex` variants for proper error handling.
</Aside>
