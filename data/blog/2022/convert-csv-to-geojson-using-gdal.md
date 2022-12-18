---
title: Convert CSV to GeoJSON using GDAL
date: '2022-12-18'
tags: ['GDAL', 'CSV', 'GeoJSON']
draft: false
summary:
---

If you have a csv file with columns for coordinates, you can convert the csv to geojson using GDAL.

## Environment

- GDAL 3.5.1

## Data

Prepare a csv file with latitude and longitude columns.

[input.csv](/static/files/2022/convert-csv-to-geojson-using-gdal/input.csv)

> This example input.csv file was extracted from [Nature Earth Populated Places](https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_populated_places_simple.zip)  
> `ogr2ogr -f CSV input.csv ne_110m_populated_places_simple.shp`

## Example 1

You can use `X_POSSIBLE_NAMES` and `Y_POSSIBLE_NAMES` options to match column of input csv file.

```bash
ogr2ogr \
    -f GeoJSON \
    output_1.geojson \
    input.csv \
    -oo X_POSSIBLE_NAMES=LONGITUDE \
    -oo Y_POSSIBLE_NAMES=LATITUDE
```

[output_1.geojson](/static/files/2022/convert-csv-to-geojson-using-gdal/output_1.geojson)

## Example 2

If you don't want to write all csv columns into geojson properties, you can filter columns or data through SQL syntax.

```bash
ogr2ogr \
    -f GeoJSON \
    output_2.geojson \
    -oo X_POSSIBLE_NAMES=LONGITUDE \
    -oo Y_POSSIBLE_NAMES=LATITUDE \
    -sql "SELECT NAME FROM input" \
    input.csv
```

[output_2.geojson](/static/files/2022/convert-csv-to-geojson-using-gdal/output_2.geojson)

## Example 3

You can also add some options to create geojson. ([geojson layer-creation-options](https://gdal.org/drivers/vector/geojson.html#layer-creation-options))

```bash
ogr2ogr \
    -f GeoJSON \
    output_3.geojson \
    -oo X_POSSIBLE_NAMES=LONGITUDE \
    -oo Y_POSSIBLE_NAMES=LATITUDE \
    -lco RFC7946=YES \
    -lco ID_GENERATE=YES \
    -lco ID_TYPE=String \
    -lco WRITE_NAME=NO \
    -sql "SELECT NAME FROM input" \
    input.csv
```

[output_3.geojson](/static/files/2022/convert-csv-to-geojson-using-gdal/output_3.geojson)

## References

- [GDAL - Comma Separated Value (.csv)](https://gdal.org/drivers/vector/csv.html)
- [GDAL - GeoJSON](https://gdal.org/drivers/vector/geojson.html)
