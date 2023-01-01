---
title: How to install osm2pgsql on ubuntu 18.04?
date: 2023-1-1'
tags: ['osm2pgsql']
draft: false
summary:
---

## Environment

- Ubuntu 18.04
- CMake 3.24.1

## With apt

You can easily install osm2pgsql with apt, but the version is not the latest version.

```bash
sudo apt install osm2pgsql
```

### Check version

```bash
osm2pgsql --version
# osm2pgsql version 0.94.0
```

> You can uninstall with `sudo apt remove osm2pgsql`

## Install the latest version from source

If you want to install the latest version of osm2pgsql, you can complie from source code.

### Download source code

Download or clone the latest release source code from GitHub.

```bash
git clone https://github.com/openstreetmap/osm2pgsql.git --branch 1.7.2
```

> (2023/01/01) The version `1.7.2` released on 2022-11-10.  
> You can also download the latest release from [release page](https://github.com/openstreetmap/osm2pgsql/releases)

### Complie and install

```bash
# ./osm2pgsql
mkdir build && cd build
cmake ..
sudo make install
```

### Check version

```bash
osm2pgsql --version
# osm2pgsql version 1.7.2
```

## Referneces

- [osm2pgsql - installation](https://osm2pgsql.org/doc/install.html)
- [openstreetmap / osm2pgsql](https://github.com/openstreetmap/osm2pgsql)
