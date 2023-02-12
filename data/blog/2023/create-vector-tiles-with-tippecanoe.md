---
title: Create vector tiles with tippecanoe
date: '2023-02-12'
tags: ['OpenStreetMap', 'Vector Tiles', 'Tippecanoe']
draft: false
summary:
---

In this article, I use [felt/tippecanoe](https://github.com/felt/tippecanoe) to create vector tiles. Because this fork supports new features that you can use FlatGeobuf as input and PMTiles as output.

However, some features are still under development. If you don't need new features, you can use [mapbox/tippecanoe](https://github.com/mapbox/tippecanoe) to create vector tiles with MBTiles as output.

## Environment

- tippecanoe v2.17.0
- GDAL 3.5.1
- Ubuntu 22.04

## Installation

```bash
git clone https://github.com/felt/tippecanoe.git
cd tippecanoe
make -j
make install
```

## Input data

You can use `GeoJSON`, `Geobuf`, `CSV` and `FlatGeobuf` (only felt/tippecanoe repository) as input format to create vector tiles.

In the previous article ([Import OSM data through osm2pgsql flex output](https://yuchuntsao.github.io/blog/2023/import-osm-data-through-osm2pgsql-flex-output)) , I use osm2pgsql flex output to import OSM `highway` data into PostGIS. This article will use these data as input source to create vector tiles.

## Export FlatGeobuf from PostGIS through GDAL

I want to use `FlatGeobuf` as input format to tippecanoe. Because `FlatGeobuf` format has better performance than `GeoJSON` when reading and writing, and the file size is smaller.

> More information about [FlatGeobuf](https://flatgeobuf.org/).

There are many different values under OpenStreetMap `Key:highway` to identify different roads. You can design layers and columns according to your needs.

> About [OpenStreetMap - Key:highway](https://wiki.openstreetmap.org/wiki/Key:highway)

In the following example, the `motorway` and `motorway_link` is filtered from the `Key:highway` through `ogr2ogr` and saved in `Flatgeobuf` format.

The `type` column in highway table is defined in the lua file when I import the data through osm2pgsql.

```bash
ogr2ogr \
  -f "FlatGeoBuf" \
  ./data/motorway.fgb \
  PG:"host=localhost dbname=osm user=yuchun password=my-password port=5432" \
  -sql "select * from highways where type in ('motorway', 'motorway_link');"
```

> You can also pre-process the data at this stage. (Simplification, attribute calculation...)

## Create vector tiles from FlatGeoBuf

`tippecanoe` has many options to generate vector tiles. You can refer to the official documentation to set options to custom your vector tiles.

### Output to MBTiles

```bash
tippecanoe \
  --force \
  -Z6 \
  -z14 \
  --coalesce-densest-as-needed \
  ./data/motorway.fgb \
  -o ./data/motorway.mbtiles \
  -l "highways"
```

### Output to PMTiles

```bash
tippecanoe \
  --force \
  -Z6 \
  -z14 \
  --coalesce-densest-as-needed \
  ./data/motorway.fgb \
  -o ./data/motorway.pmtiles \
  -l "highways"
```

### Output to directory

```bash
tippecanoe \
  --force \
  -Z6 \
  -z14 \
  --coalesce-densest-as-needed \
  ./data/motorway.fgb \
  -pC \
  -e ./motorway_tiles \
  -l "highways"
```

---

## Using your vector tiles

### Host MBTiles

If you output vector tiles as `MBTiles`, you can use `tileserver-gl-light` to host your `MBTiles`.

```bash
tileserver-gl-light ./data/motorway.mbtiles
```

The ZXY URL is [`http://localhost:8080/data/motorway/{z}/{x}/{y}.pbf`](http://localhost:8080/data/motorway/{z}/{x}/{y}.pbf)

> You can install `tileserver-gl-light` with `npm install -g tileserver-gl-light`.  
> If you want to change more behavior about `tileserver-gl-light`, you can follow [TileServer GL documentation](https://tileserver.readthedocs.io/en/latest/) . The documentation has example about configuration file.

### Host directory or PMTiles

If you output vector tiles to `directory` or `PMTiles`, you can use `http-server` or other HTTP server to host it.

```bash
# Output directory
http-server --port 8081 ./motorway_tiles
```

The URL is [`http://localhost:8081/{z}/{x}/{y}.pbf`](http://localhost:8081/{z}/{x}/{y}.pbf)

```bash
# PMTiles in current directory
http-server --port 8082 .
```

The URL is [`http://localhost:8082/{z}/{x}/{y}.pbf`](http://localhost:8082/{z}/{x}/{y}.pbf)

### Open your vector tiles in QGIS

Set the URL in QGIS to access your pbf file.

![Vector Tiles Connection](/static/images/2023/create-vector-tiles-with-tippecanoe/vector_tiles_connection.png)

> You can also create a `style.json` to define layer style with mapbox style specification.

Add this layer into map.

![Vector Tiles in QGIS](/static/images/2023/create-vector-tiles-with-tippecanoe/vector_tiles_in_qgis.png)

## References

- [felt/tippecanoe](https://github.com/felt/tippecanoe)
- [mapbox/tippecanoe](https://github.com/mapbox/tippecanoe)
- [FlatGeobuf](https://flatgeobuf.org/)
- [OpenStreetMap - Key:highway](https://wiki.openstreetmap.org/wiki/Key:highway)
- [TileServer GL documentation](https://tileserver.readthedocs.io/en/latest/)
