---
title: Get tile index from a polygon?
date: '2024-10-13'
tags: ['']
draft: true
---

利用 PMTiles 提供的 `zxy_to_tileid` 以及 `tileid_to_zxy` 方法，將 ZXY 的圖磚服務儲存為 PMTiles 格式。

```js
for tileid in range(0, zxy_to_tileid(9, 0, 0)):
    acc += 1
    z, x, y = tileid_to_zxy(tileid)
    req = Request(f"http://127.0.0.1:8080/tile/{z}/{x}/{y}.png")
    with urlopen(req) as f:
        writer.write_tile(tileid, f.read())
```
