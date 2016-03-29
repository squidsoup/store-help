Ubuntu Store Help Site
======================

![Ubuntu](src/img/ubuntu-logo.png)

This site provides documentation for the [Ubuntu Store](https://myapps.developer.ubuntu.com).

# Getting started

## Installing Nodejs/NPM

    sudo apt-add-repository ppa:wesmason/nodejs-backport
    sudo apt-get install nodejs npm

## Install Project Dependencies

    npm install

## Build the Site

    make build

### Snapcraft Docs

Snapcraft docs live in the official ubuntu-core [snapcraft repository](https://github.com/ubuntu-core/snapcraft/), but can be fetched and annotated with the appropriate yaml frontmatter using:

    make fetch_snapcraft_docs

## Develop

The following task will watch source files and rebuild the site for you:

    make watch

note: A bug with metalsmith-collections currently whereby the Metalsmith object metadata is not correctly purged, may result in duplicate collections rendering while watched.

## Author

Draft documents with the YAML frontmatter `draft` key set to `true` will not be rendered when the site is built, e.g.

```yaml
---
title: My Draft Document
draft: true
---

# My Draft Document
```
