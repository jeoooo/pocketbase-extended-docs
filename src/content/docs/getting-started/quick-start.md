---
title: Quick Start
description: Connect to PocketBase and perform your first CRUD operations in a few lines.
---

import { Aside } from '@astrojs/starlight/components';

## 1. Connect to WiFi

```cpp
#include <PocketbaseExtended.h>
#include <ESP8266WiFi.h>   // or <WiFi.h> for ESP32

const char* ssid     = "YOUR_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

PocketbaseExtended pb("https://YOUR_POCKETBASE_HOST");

void setup() {
    Serial.begin(115200);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected");
}
```

## 2. Fetch a record

```cpp
String rec = pb.collection("notes").getOne("RECORD_ID");
Serial.println(rec);  // raw JSON body
```

Use the `Ex` variant when you need the status code or structured error:

```cpp
PBResponse resp = pb.collection("notes").getOneEx("RECORD_ID");

if (resp.ok) {
    Serial.println(resp.body);       // JSON body
} else {
    Serial.println(resp.statusCode); // e.g. 404
    Serial.println(resp.error);      // human-readable error
}
```

## 3. Create a record

```cpp
PBResponse created = pb.collection("notes").createEx(
    "{\"title\":\"Hello from ESP\",\"active\":true}"
);

if (created.ok) {
    Serial.println("Created: " + created.body);
}
```

## 4. Update a record

```cpp
PBResponse updated = pb.collection("notes").updateEx(
    "RECORD_ID",
    "{\"title\":\"Updated title\"}"
);
```

Only the fields present in the JSON body are changed — omitted fields keep their current values (PocketBase PATCH semantics).

## 5. Delete a record

```cpp
PBResponse deleted = pb.collection("notes").deleteRecordEx("RECORD_ID");

if (deleted.ok) {
    Serial.println("Deleted");   // HTTP 204, body is empty
}
```

## Full sketch

```cpp
#include <PocketbaseExtended.h>
#include <ESP8266WiFi.h>   // or <WiFi.h> for ESP32

const char* ssid     = "YOUR_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

PocketbaseExtended pb("https://YOUR_POCKETBASE_HOST");

void setup() {
    Serial.begin(115200);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected");

    // Enable debug output during development
    // pb.setDebug(true);

    // Fetch
    String rec = pb.collection("notes").getOne("RECORD_ID");
    Serial.println("getOne: " + rec);

    // List newest 10
    String list = pb.collection("notes").getList("1", "10", "-created");
    Serial.println("getList: " + list);

    // Create
    String created = pb.collection("notes").create("{\"title\":\"Hello\",\"body\":\"from ESP\"}");
    Serial.println("create: " + created);

    // Update
    String updated = pb.collection("notes").update("RECORD_ID", "{\"title\":\"Updated\"}");
    Serial.println("update: " + updated);

    // Delete
    pb.collection("notes").deleteRecord("RECORD_ID");
}

void loop() {
    // Poll every 10 seconds
    String list = pb.collection("notes").getList(nullptr, nullptr, "-created");
    Serial.println(list);
    delay(10000);
}
```

<Aside type="tip">
  Call `pb.setDebug(true)` early in `setup()` to print every request URL, status code, and response body to Serial. Turn it off before deploying to production.
</Aside>
