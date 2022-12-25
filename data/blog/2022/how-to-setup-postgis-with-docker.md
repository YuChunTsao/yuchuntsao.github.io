---
title: How to setup PostGIS with docker?
date: '2022-12-25'
tags: ['postgis', 'docker']
draft: false
summary:
---

## Environment

- Ubuntu 18.04
- docker 20.10.7
- docker-compose 1.24.1

## With docker

```bash
docker run \
  --rm \
  --name some-postgis \
  -e POSTGRES_PASSWORD=your-secret-password \
  -d postgis/postgis
```

You can connect to the database either directly on the running container.

```bash
docker exec -ti some-postgis psql -U postgres
```

or you can define a docker network to link this database container.

```bash
docker network create some-network

# Server container
docker run \
  --name some-postgis \
  --network some-network \
  -e POSTGRES_PASSWORD=your-secret-password \
  -d postgis/postgis

# Client container
docker run \
  -ti \
  --rm \
  --network some-network \
  postgis/postgis \
  psql -h some-postgis -U postgres
```

If you want to connect to database with other GUI application, you can look up this container ip with `docker inspect`:

```bash
docker inspect some-postgis | grep IPAddress
# or inspect this network
docker network inspect some-network
```

### Persist data with docker volume

```bash
docker run \
  -d \
  --name some-postgis \
  --network some-network \
  -v $(pwd)/pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=your-secret-password \
  postgis/postgis
```

> `docker stop some-postgis` -> Stop this container  
> `docker rm some-postgis` -> Remove this container  
> `docker network rm some-network` -> Remove this network

## With docker compose

You can setup postgis with other services.

`docker-compose.yml`

```yaml
version: '3'
services:
  postgis:
    image: postgis/postgis
    container_name: postgis_example
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

Some secret or dev information is written in the `.env` file.

```txt
# .env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secret-password
POSTGRES_DB=postgres
POSTGRES_PORT=5432
```

Run this container is background with docker-compose.

```base
docker-compose up -d
```

> `docker-compose stop` -> Stop services  
> `docker-compose down` -> Stop and remove containers, networks, volumes and images created by `up`.

## References

- [Docker Hub - postgis/postgis](https://registry.hub.docker.com/r/postgis/postgis/)
- [Environment variables in Compose](https://docs.docker.com/compose/environment-variables/)
