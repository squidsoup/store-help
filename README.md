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
