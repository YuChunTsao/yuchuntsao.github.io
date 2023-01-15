---
title: Extract OSM data with Osmium
date: '2023-01-15'
tags: ['Osmium', 'OpenStreetMap']
draft: false
summary:
---

The previous article ([import-osm-data-into-postgis-with-osm2pgsql](https://yuchuntsao.github.io/blog/2023/import-osm-data-into-postgis-with-osm2pgsql)) introduces how to import OSM data into PostGIS through osm2pgsql. In this article, I will extract OSM with Osmium and import customized `osm.pbf` into PostGIS.

## Environment

- Ubuntu 18.04
- CMake 3.24.1

## Installation

Follow the official documentation to install: [Osmium Command Line Tool](https://github.com/osmcode/osmium-tool)

## Download OSM data

Download from geofabrik

In this article, I will use [taiwan-latest.osm.pbf](https://download.geofabrik.de/asia/taiwan-latest.osm.pbf) for the next step.

You can use `osmium fileinfo` to inspect your `osm.pbf` file

```bash
osmium fileinfo taiwan-latest.osm.pbf
```

```txt
File:
  Name: taiwan-latest.osm.pbf
  Format: PBF
  Compression: none
  Size: 114332934
Header:
  Bounding boxes:
    (118.1036,20.72799,122.9312,26.60305)
  With history: no
  Options:
    generator=osmium/1.14.0
    osmosis_replication_base_url=http://download.geofabrik.de/asia/taiwan-updates
    osmosis_replication_sequence_number=3577
    osmosis_replication_timestamp=2023-01-14T21:21:25Z
    pbf_dense_nodes=true
    pbf_optional_feature_0=Sort.Type_then_ID
    sorting=Type_then_ID
    timestamp=2023-01-14T21:21:25Z
```

> You can use `-e` option to show more information about the pbf.

## Creating geographic extracts

### Extract with bounding box

```bash
osmium extract \
  -s simple \
  -b 121.561,25.030,121.568,25.036 \
  taiwan-latest.osm.pbf \
  -o bounding_box_output.pbf
```

> `-s`, `--strategy`  
> Osmium offers three different extract strategies `simple`, `complete_ways`(default) and `smart`. Their results are different, more or less OSM objects will be included in the output.  
> More information about extract strategy can read manual of Osmium.

![Extract with bounding box](/static/images/2023/extract-osm-data-with-osmium/extract_with_bbox.png)

### Extract with OSM boundary

You can find relation id from [OpenStreetMap](https://www.openstreetmap.org/).

In my case, I typed `taipei` keyword in search bar to find the relation id of Taipei City as [1293250](https://www.openstreetmap.org/relation/1293250).

![Get relation id from openstreetmap](/static/images/2023/extract-osm-data-with-osmium/get_relation_id_from_osm.png)

Extract the boundary through the relation id of Taipei City.

```bash
osmium getid -r -t taiwan-latest.osm.pbf r1293250 -o taipei-boundary.osm
```

Then extract the pbf file of Taipei City through `taipei-boundary.osm`.

```bash
osmium extract -s simple -p taipei-boundary.osm taiwan-latest.osm.pbf -o boundary_output.pbf
```

![Extract with OSM boundary](/static/images/2023/extract-osm-data-with-osmium/extract_with_osm_boundary.png)

### Extract with GeoJSON

If you have geographic data in GeoJSON format also used to extract the data.

I got a circle from [geojson.io](https://geojson.io/) as my input geojson data.

![Example GeoJSON](/static/images/2023/extract-osm-data-with-osmium/example_geojson.png)

Extract data through the circle in GeoJSON format.

```bash
osmium extract -s simple -p polygon.geojson taiwan-latest.osm.pbf -o geojson_output.pbf
```

![Extract with GeoJSON](/static/images/2023/extract-osm-data-with-osmium/extract_with_geojson.png)

## Several extracts with config file

The config file is in JSON format.
The top-level is an object which contains at least an `extracts` array.
It can also contain a `directory` entry which names the directory where all the output files will be created.

`config.json`

```json
{
  "extracts": [
    {
      "output": "bounding_box_output.pbf",
      "output_format": "pbf",
      "description": "extract with bbox",
      "bbox": [121.561, 25.03, 121.568, 25.036]
    },
    {
      "output": "boundary_output.pbf",
      "description": "extract with osm boundary",
      "polygon": {
        "file_name": "taipei-boundary.osm",
        "file_type": "osm"
      }
    },
    {
      "output": "geojson_output.pbf",
      "description": "extract with geojson polygon",
      "polygon": {
        "file_name": "polygon.geojson",
        "file_type": "geojson"
      }
    }
  ],
  "directory": "./output/"
}
```

> The output directory must exist.

Extract data with this config file.

```bash
osmium extract -s simple -c config.json taiwan-latest.osm.pbf
```

After execution you will be able to find the pbf in the output directory.

```txt
$ tree output
output
├── boundary_output.pbf
├── bounding_box_output.pbf
└── geojson_output.pbf

0 directories, 3 files
```

## References

- [Osmium manual](https://osmcode.org/osmium-tool/manual.html)
- [Osmium extract](https://docs.osmcode.org/osmium/latest/osmium-extract.html)
- [Osmium Command Line Tool](https://github.com/osmcode/osmium-tool)
