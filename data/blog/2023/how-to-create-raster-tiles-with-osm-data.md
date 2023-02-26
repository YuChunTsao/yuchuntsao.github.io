---
title: How to create raster tiles with OSM data
date: '2023-02-26'
tags: ['OpenStreetMap', 'Raster Tiles', 'Docker']
draft: false
summary:
---

## Demo

In this example, I will use `openstreetmap-tile-server` to create raster tiles from OpenStreetMap data.
You can give more information about using tiles or serving tiles from [switch2osm](https://switch2osm.org/).

<MaplibreGL style="https://yuchuntsao.github.io/custom-raster-tiles/osm-taipei-city/style.json" isPMTiles={true} PMTILES_URL="https://yuchuntsao.github.io/custom-raster-tiles/osm-taipei-city/data/osm-taipei-city.pmtiles"/>

## Prerequisites

- Docker

## Getting Started

### Prepare input data

You can download the `osm.pbf` you want. In my case, I use `taipei.osm.pbf` as input data which was extracted from `taiwan-latest.osm.pbf`.

### Create a docker volume

```bash
docker volume create openstreetmap-data
```

> You can remove this docker volume with `docker volume rm openstreetmap-data`

### Import your data

```bash
time \
docker run \
  --rm \
  --name openstreetmap-tile-server \
  -v ${PWD}/data/taipei.osm.pbf:/data.osm.pbf \
  -v openstreetmap-data:/var/lib/postgresql/12/main \
  overv/openstreetmap-tile-server:1.3.10 \
  import
```

### Run the tile server

```bash
docker run \
  --rm \
  --name openstreetmap-tile-server \
  -p 8080:80 \
  -v openstreetmap-data:/var/lib/postgresql/12/main \
  -d \
  overv/openstreetmap-tile-server:1.3.10 \
  run
```

> You can stop container with `docker stop openstreetmap-tile-server`

Go to example [`http://127.0.0.1:8080`](http://127.0.0.1:8080).

You can access tiles with [`http://127.0.0.1:8080/tile/{z}/{x}/{y}.png`](http://127.0.0.1:8080/tile/{z}/{x}/{y}.png)

## References

- [switch2osm](https://switch2osm.org/)
- [openstreetmap-tile-server](https://github.com/Overv/openstreetmap-tile-server)
