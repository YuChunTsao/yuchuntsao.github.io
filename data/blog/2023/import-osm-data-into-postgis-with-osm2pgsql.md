---
title: Import OSM data into PostGIS with osm2pgsql
date: '2023-01-08'
tags: ['osm2pgsql', 'OpenStreetMap', 'PostGIS']
draft: false
summary:
---

## Prerequisites

- PostGIS
- osm2pgsql

> Related articles:
>
> - [How to setup PostGIS with docker?](https://yuchuntsao.github.io/blog/2022/how-to-setup-postgis-with-docker)
> - [How to install osm2pgsql on ubuntu 18.04?](https://yuchuntsao.github.io/blog/2023/how-to-install-osm2pgsql-on-ubuntu-18-04)

## Preparing the database

In this article, I will use docker to create the database. You can also install PostgreSQL/PostGIS on your machine (Follow the instrcution from the official documentation: [Preparing the Database](https://osm2pgsql.org/doc/manual.html#preparing-the-database)).

`docker-compose.yml`

```yaml
version: '3'
services:
  postgis:
    image: postgis/postgis
    container_name: osm2pgsql-postgis
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
      - PGDATA=/var/lib/postgresql/data/pgdata
    ports:
      - '${POSTGRES_PORT}:5432'
    volumes:
      - ${PWD}/pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready']
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  pgdata:
```

Run postgis container with docker compose

```bash
docker-compose up -d
```

Create user and database for using osm2pgsql.

- user: `osmuser`
- database: `osm`

```bash
docker-compose exec postgis psql -U postgres -c "create user osmuser with encrypted password 'osmuser-password';"
docker-compose exec postgis psql -U postgres -c "create database osm owner osmuser;"
docker-compose exec postgis psql -U postgres -d osm -c "create extension postgis;"
docker-compose exec postgis psql -U postgres -d osm -c "create extension hstore;"
```

Connect to osm database with osmuser.

```bash
docker-compose exec postgis psql -d osm -U osmuser
```

You can use `\c` to check connection information.

```bash
$ docker-compose exec postgis psql -d osm -U osmuser
psql (13.2 (Debian 13.2-1.pgdg100+1))
Type "help" for help.

osm=> \c
You are now connected to database "osm" as user "osmuser".
```

> You can use your favorite database tool to connect to the database.

## Using osm2pgsql import OSM data into PostGIS

### Download OSM data

OpenStreetMap data can download or extract from different services.

- [geofabrik downloads](https://download.geofabrik.de/)
- [Export - OpenStreetMap](https://www.openstreetmap.org/export)
- [overpass turbo](https://overpass-turbo.eu/)
- [protomaps downloads](https://app.protomaps.com/downloads)
- ...

In this article, I download [liechtenstein-latest.osm.pbf](http://download.geofabrik.de/europe/liechtenstein-latest.osm.pbf) from geofabrik to try the import.

> The osm2pgsql documentation describes how to get OSM data: [Getting and Preparing OSM Data](https://osm2pgsql.org/doc/manual.html#getting-and-preparing-osm-data)

### Import OSM data

You have to tell osm2pgsql which database to access. In my case, I want to connect to a postgis container.

Usually osm2pgsql will autodetect the file format, but you can use `-r, --input-reader`
option to select format of the input file.

```bash
osm2pgsql -H localhost -U osmuser -d osm -P 5432 -W -c ./liechtenstein-latest.osm.pbf
```

> For more detailed information, you can read the official document:
>
> - [Database connection](https://osm2pgsql.org/doc/manual.html#database-connection)
> - [The Input](https://osm2pgsql.org/doc/manual.html#the-input)

### Check data in postgis

Connect to postgis and use `\dt` to show tables.

```bash
$ docker-compose exec postgis psql -d osm -U osmuser

psql (13.2 (Debian 13.2-1.pgdg100+1))
Type "help" for help.

osm=> \dt
               List of relations
 Schema |        Name        | Type  |  Owner
--------+--------------------+-------+----------
 public | planet_osm_line    | table | osmuser
 public | planet_osm_point   | table | osmuser
 public | planet_osm_polygon | table | osmuser
 public | planet_osm_roads   | table | osmuser
 public | spatial_ref_sys    | table | postgres
(5 rows)
```

You can use SQL query to check geometry data.

```bash
osm=> select osm_id, ST_AsText(way) geometry from planet_osm_point limit 5;
   osm_id   |                  geometry
------------+---------------------------------------------
 8071657539 | POINT(1064969.6124648296 5981399.637550142)
 8071657541 | POINT(1065027.5431278383 5981494.885103285)
 3891992171 | POINT(1065878.881197578 5981755.169248388)
 7821023400 | POINT(1065010.7450166778 5981878.214184752)
  966230920 | POINT(1063066.1048320099 5990334.432385214)
(5 rows)
```

You can use other applications to preview the data.

The following figure previews the data through [DBeaver](https://dbeaver.io/).

![preview-osm-data-with-dbeaver](/static/images/2023/import-osm-data-into-postgis-with-osm2pgsql/preview-osm-data-with-dbeaver.png)

> osm2pgsql default projection is Web Mercator ([EPSG:3857](https://epsg.io/3857)), you can use lua script to set projection.

## References

- [OSM2PGSQL MANUAL](https://osm2pgsql.org/doc/manual.html)
