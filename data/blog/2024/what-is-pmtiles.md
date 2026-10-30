---
title: What is pmtiles?
date: '2024-10-13'
tags: ['pmtiles']
draft: true
summary:
---

1. Abstract

PMTiles is a single-file archive format for tiled data.

The recommanded MIME type for PMTiles is `application/vnd.pmtiles`.

2. Overview

1. A fixed-size 127-byte header
1. A root directory
1. JSON metadata
1. Optional leaf directories
1. The actual tile data

1. Header

長度為 127 bytes, 總是會在檔案的開頭，包含了所有需要被編碼進檔案的資訊。

4. Directories

A directory is simply a list of entries. Each entry describes either where a
specific tile can be found in the tile data section or where a leaf directory
can be found in the leaf directory section.

## References

- [PMTiles Version 3 Specification](https://github.com/protomaps/PMTiles/blob/main/spec/v3/spec.md)
