Ubuntu Store Help Site
======================

# Getting started

## Installing Nodejs/NPM

    sudo apt-add-repository ppa:wesmason/nodejs-backport
    sudo apt-get install nodejs npm

## Install Project Dependencies

    npm install

## Build the Site

    make build

## Develop

The following task will watch source files and rebuild the site for you:

    make watch

note: A bug with metalsmith-collections currently whereby the Metalsmith object metadata is not correctly purged, may result in duplicate collections rendering while watched.
