---
title: How to install and setup PostGIS on Ubuntu 22.04?
date: '2023-01-29'
tags: ['PostGIS']
draft: false
summary:
---

## Install PostgreSQL

Import the repository key from [https://www.postgresql.org/media/keys/ACCC4CF8.asc](https://www.postgresql.org/media/keys/ACCC4CF8.asc)

```bash
sudo apt install curl ca-certificates gnupg
curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg >/dev/null
```

Create source list with your distribution

```bash
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
```

Update and install package

```bash
sudo apt update
sudo apt install -y postgresql
```

You can also specify the version you want to install.

```bash
sudo apt install -y postgresql-15
```

> Uninstall command: `sudo apt --purge autoremove postgresql`

## Install PostGIS

```bash
sudo apt install -y postgis
```

> Uninstall command: `sudo apt --purge autoremove postgis`

## Setup Database

### Create user

```bash
sudo -u postgres createuser username
```

Using password authentication to connect database, you can use `-P` or `--pwprompt` to set user password.

```bash
sudo -u postgres createuser username -P
```

> More information about [PostgreSQL Authentication Methods](https://www.postgresql.org/docs/current/auth-methods.html)

### Create database

Set the owner of this database to `username`

```bash
sudo -u postgres createdb --encoding=UTF8 --owner=username dbname
```

### Create PostGIS extension

```bash
sudo -u postgres psql dbname --command='CREATE EXTENSION postgis;'
```

### Connect to database with `username`

```bash
psql -h localhost -U username -d dbname -W
```

You can also link to this database through QGIS

![qgis-postgis-connection-information](/static/images/2023/how-to-install-and-setup-postgis-on-ubuntu-22-04/qgis-postgis-connection-information.png)

## References

- [PostgreSQL Downloads](https://www.postgresql.org/download/)
- [PostgreSQL Apt Repository](https://wiki.postgresql.org/wiki/Apt)
