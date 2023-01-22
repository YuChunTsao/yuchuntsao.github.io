---
title: Linux backup with Duplicity
date: '2023-01-22'
tags: ['Linux', 'Backup', 'Duplicity']
draft: false
summary:
---

## Environment

- Ubuntu 18.04
- Duplicty 0.8.21

## Example backup directory

```bash
$ tree -L 2 ./projects
./projects
├── node-project
│   ├── main.js
│   ├── node_modules
│   ├── package.json
│   └── package-lock.json
└── python-project
    ├── main.py
    └── venv

4 directories, 4 files
```

## Backup this directory

```bash
$ duplicity projects file:///home/yuchun/duplicity_example/backup_projects

Local and Remote metadata are synchronized, no sync needed.
Last full backup date: none
GnuPG passphrase for decryption:
Retype passphrase for decryption to confirm:
No signatures found, switching to full backup.
--------------[ Backup Statistics ]--------------
StartTime 1674398127.88 (Sun Jan 22 22:35:27 2023)
EndTime 1674398129.07 (Sun Jan 22 22:35:29 2023)
ElapsedTime 1.18 (1.18 seconds)
SourceFiles 2631
SourceFileSize 27699793 (26.4 MB)
NewFiles 2631
NewFileSize 27699793 (26.4 MB)
DeletedFiles 0
ChangedFiles 0
ChangedFileSize 0 (0 bytes)
ChangedDeltaSize 0 (0 bytes)
DeltaEntries 2631
RawDeltaSize 26532300 (25.3 MB)
TotalDestinationSizeChange 8134554 (7.76 MB)
Errors 0
-------------------------------------------------
```

Hierarchical structure about this backup directory.

```txt
$ tree ./backup_projects
./backup_projects
├── duplicity-full.20230122T143524Z.manifest.gpg
├── duplicity-full.20230122T143524Z.vol1.difftar.gpg
└── duplicity-full-signatures.20230122T143524Z.sigtar.gpg

0 directories, 3 files
```

If I add a new file in the `node-project`, make a backup again.

Add `README.md`

```bash
touch ./projects/node-project/README.md
```

Duplicity will be based on the last full backup.

```bash
$ duplicity projects file:///home/yuchun/duplicity_example/backup_projects

Local and Remote metadata are synchronized, no sync needed.
Last full backup date: Sun Jan 22 22:35:24 2023
GnuPG passphrase for decryption:
Retype passphrase for decryption to confirm:
--------------[ Backup Statistics ]--------------
StartTime 1674398221.21 (Sun Jan 22 22:37:01 2023)
EndTime 1674398221.46 (Sun Jan 22 22:37:01 2023)
ElapsedTime 0.24 (0.24 seconds)
SourceFiles 2632
SourceFileSize 27699793 (26.4 MB)
NewFiles 2
NewFileSize 4096 (4.00 KB)
DeletedFiles 0
ChangedFiles 0
ChangedFileSize 0 (0 bytes)
ChangedDeltaSize 0 (0 bytes)
DeltaEntries 2
RawDeltaSize 0 (0 bytes)
TotalDestinationSizeChange 235 (235 bytes)
Errors 0
-------------------------------------------------
```

Hierarchical structure about this backup directory.

```bash
$ tree ./backup_projects
./backup_projects
├── duplicity-full.20230122T143524Z.manifest.gpg
├── duplicity-full.20230122T143524Z.vol1.difftar.gpg
├── duplicity-full-signatures.20230122T143524Z.sigtar.gpg
├── duplicity-inc.20230122T143524Z.to.20230122T143656Z.manifest.gpg
├── duplicity-inc.20230122T143524Z.to.20230122T143656Z.vol1.difftar.gpg
└── duplicity-new-signatures.20230122T143524Z.to.20230122T143656Z.sigtar.gpg

0 directories, 6 files
```

## Restore

```bash
duplicity file:///home/yuchun/duplicity_example/backup_projects restore_projects
```

You need to input your passphrase.

```txt
Local and Remote metadata are synchronized, no sync needed.
Last full backup date: Sun Jan 22 18:32:44 2023
GnuPG passphrase for decryption
```

Hierarchical structure about this restore directory.

```bash
$ tree -L 2 ./restore_projects
./restore_projects
├── node-project
│   ├── main.js
│   ├── node_modules
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
└── python-project
    ├── main.py
    └── venv

4 directories, 5 files
```

## Exclude something

To ignore `node_modules` and `venv` directories, you can pass the following command.

```bash
$ duplicity --exclude="**/node_modules" --exclude="**/venv" projects file:///home/yuchun/duplicity_example/backup_with_exclude_projects

Local and Remote metadata are synchronized, no sync needed.
Last full backup date: none
GnuPG passphrase for decryption:
Retype passphrase for decryption to confirm:
No signatures found, switching to full backup.
--------------[ Backup Statistics ]--------------
StartTime 1674398644.59 (Sun Jan 22 22:44:04 2023)
EndTime 1674398644.60 (Sun Jan 22 22:44:04 2023)
ElapsedTime 0.01 (0.01 seconds)
SourceFiles 8
SourceFileSize 36096 (35.2 KB)
NewFiles 8
NewFileSize 36096 (35.2 KB)
DeletedFiles 0
ChangedFiles 0
ChangedFileSize 0 (0 bytes)
ChangedDeltaSize 0 (0 bytes)
DeltaEntries 8
RawDeltaSize 23808 (23.2 KB)
TotalDestinationSizeChange 8305 (8.11 KB)
Errors 0
-------------------------------------------------
```

Restore this backup

```bash
duplicity file:///home/yuchun/duplicity_example/backup_with_exclude_projects restore_with_exclude_projects
```

Hierarchical structure about this directory.

```bash
$ tree -L 2 ./restore_with_exclude_projects

./restore_with_exclude_projects
├── node-project
│   ├── main.js
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
└── python-project
    └── main.py

2 directories, 5 files
```

## References

- [duplicity man page](https://manpages.ubuntu.com/manpages/trusty/en/man1/duplicity.1.html)
