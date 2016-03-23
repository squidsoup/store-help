'use strict';

const Metalsmith = require('metalsmith');
const blc = require('metalsmith-broken-link-checker');
const collections = require('metalsmith-collections');
const permalinks  = require('metalsmith-permalinks');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const msIf = require('metalsmith-if');
const watch = require('metalsmith-watch');
const rootPath = require('metalsmith-rootpath');

let opts = {}
opts.watch = false;

let argv = require('yargs').argv;
if (argv.watch == 'true') {
  opts.watch = argv.watch;
}

Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .use(rootPath())
  .use(collections({
    Home: {
      pattern: ''
    },
    Guides: {
      pattern: 'content/guides/*.md'
    },
    Snapcraft: {
      pattern: 'content/snapcraft/*.md'
    }
  }))
  .use(markdown({
    gfm: true
  }))
  .use(permalinks({
    pattern: ':title'
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: 'layouts',
    partials: 'partials'
  }))
  .use(blc({warn: true}))
  .use(msIf(
    opts.watch,
    watch({
    paths: {
      "${source}/**/*": "**/*",
      "layouts/**/*": "**/*",
      "partials/**/*": "**/*"
    }
  })))
  .build(function(err) {
    if (err) throw err;
    console.log('Build Completed.');
  });
  
