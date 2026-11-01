---
title: A Comparison of ArcGIS GeoJSONLayer and Deck.gl GeoJsonLayer
date: '2024-10-12'
tags: ['ArcGIS API for JavaScript', 'deck.gl', 'GeoJSON']
draft: true
---

## OpenGL Anti-aliasing Issue

deckgl GeoJsonLayer 繪製到 ArcGIS MapView 後，不支持抗鋸齒效果 (Anti-aliased) ，導致線條顯得粗糙。

![aliased line](/static/images/2024/arcgis-deckgl-geojson/aliased_line.png)

## 等待 deck.gl GeoJsonLayer 加載完成

如果沒有等待 GeoJsonLayer 加載完成，會導致圖層無法正確顯示。

```js
let linestring_layer = new deck.GeoJsonLayer({
  id: 'linestrings',
  data: LINESTRING_URL,
  getLineColor: LINESTRING_COLOR,
  getLineWidth: 3,
  lineWidthMinPixels: 2,
  onDataLoad: () => {
    console.log('linestrings loaded')
  },
  onAfterRender: () => {
    console.log('linestrings rendered')
  },
})

let linestring_interval_id = setInterval(() => {
  if (linestring_layer.lifecycle === 'Awaiting state') {
    linestring_deck_layer.deck.layers = [linestring_layer]
  } else {
    clearInterval(linestring_interval_id)
  }
}, 100)
```

## 渲染、事件需要使用 deck.gl 的方法

## References

[Drawing Antialiased Lines with OpenGL](https://blog.mapbox.com/drawing-antialiased-lines-with-opengl-8766f34192dc)
