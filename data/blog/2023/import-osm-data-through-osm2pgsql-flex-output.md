---
title: Import OSM data through osm2pgsql flex output
date: '2023-02-05'
tags: ['osm2pgsql', 'OpenStreetMap', 'PostGIS']
draft: false
summary:
---

## Environment

- PostGIS
- osm2pgsql 1.7.2

## osm2pgsql flex output

The official introduction:

> The flex output, as the name suggests, allows for a flexible configuration that tells osm2pgsql what OSM data to store in your database and exactly where and how. It is configured through a Lua file which
>
> - defines the structure of the output tables and
> - defines functions to map the OSM data to the database data format

In my case, I want to extract OSM highway data from `taipei.osm.bpf` and import to PostGIS. In the Lua file, I defined a way table and columns, and get `Key:highway` information in the `process_way` function.

`highways.lua`

```lua
-- osm2pgsql projection default is EPSG:3857
local srid = 4326
local tables = {}

tables.highways = osm2pgsql.define_way_table('highways', {{
    column = 'name',
    type = 'text'
}, {
    column = 'name_en',
    type = 'text'
}, {
    column = 'type',
    type = 'text'
}, {
    column = 'geom',
    type = 'linestring',
    not_null = true,
    projection = srid
}})

function osm2pgsql.process_way(object)
    if not object.tags.highway then
        return
    end

    local row = {
        name = object.tags['name'],
        name_en = object.tags['name:en'],
        type = object.tags.highway,
        geom = object:as_linestring()
    }

    tables.highways:insert(row)
end
```

Execute the osm2pgsql command

```bash
osm2pgsql -d osm -O flex -S highways.lua ./data/taipei.osm.pbf
```

## View in QGIS

![view in qgis](/static/images/2023/import-osm-data-through-osm2pgsql-flex-output/view_in_qgis.png)

## References

- [osm2pgsql manual - The Flex Output](https://osm2pgsql.org/doc/manual.html#the-flex-output)
- [osm2pgsql examples](https://osm2pgsql.org/examples/)
- [Flex Output Configuration](https://github.com/openstreetmap/osm2pgsql/tree/master/flex-config)
- [OpenStreetMap - Key:highway](https://wiki.openstreetmap.org/wiki/Key:highway)
