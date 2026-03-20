---
title: Installation
description: How to install PocketbaseExtended in the Arduino IDE or PlatformIO.
---

## Arduino IDE

1. Download or clone the [PocketbaseExtended repository](https://github.com/jeoooo/PocketbaseExtended).
2. In the Arduino IDE go to **Sketch → Include Library → Add .ZIP Library…** and select the downloaded ZIP, **or** copy the folder directly into your Arduino `libraries/` directory.
3. Restart the IDE. The library now appears under **Sketch → Include Library → PocketbaseExtended**.

## PlatformIO

Add the library to your `platformio.ini`:

```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
lib_deps =
    https://github.com/jeoooo/PocketbaseExtended
```

Run `pio lib install` (or let PlatformIO install it automatically on the next build).

## Dependencies

PocketbaseExtended has **no external library dependencies**. It uses only:

| Platform | Built-in libraries required |
|---|---|
| ESP8266 | `ESP8266WiFi`, `ESP8266HTTPClient`, `BearSSLHelpers` |
| ESP32 | `WiFi`, `HTTPClient`, `WiFiClientSecure` |

All of these ship with the official ESP8266 and ESP32 Arduino board packages.

## Include

Add the single header to your sketch:

```cpp
#include <PocketbaseExtended.h>
```

No platform-specific `#include` is needed in your sketch — the library detects the target automatically.
