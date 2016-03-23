'use strict';

const Metalsmith = require('metalsmith');
const blc = require('metalsmith-broken-link-checker');
const collections = require('metalsmith-collections');
const drafts = require('metalsmith-drafts');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const msIf = require('metalsmith-if');
const permalinks  = require('metalsmith-permalinks');
const rootPath = require('metalsmith-rootpath');
const watch = require('metalsmith-watch');

let opts = {};
let argv = require('yargs').argv;

opts.watch = false;

if (argv.watch == 'true') {
  opts.watch = argv.watch;
}

Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .use(rootPath())
  .use(drafts())
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
        '${source}/**/*': '**/*',
        'layouts/**/*': '**/*',
        'partials/**/*': '**/*'
      }
    })))
  .build(function(err) {
    if (err) throw err;
    console.log('Build Completed.');
  });
