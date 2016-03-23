'use strict';

const Metalsmith = require('metalsmith');
const blc = require('metalsmith-broken-link-checker');
const collections = require('metalsmith-collections');
const drafts = require('metalsmith-drafts');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const nunjucks = require('nunjucks');
const msIf = require('metalsmith-if');
const permalinks  = require('metalsmith-permalinks');
const rootPath = require('metalsmith-rootpath');
const watch = require('metalsmith-watch');

const sorter = require('./sorter').sorter;

let opts = {};
let argv = require('yargs').argv;

nunjucks.configure('./templates', {watch: false});
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
      pattern: 'content/snapcraft/*.md',
      sortBy: sorter([
        'Intro',
        'Get Started',
        'Your First Snap',
        'Snapcraft Advanced Features',
        'Snapcraft Usage',
        'Snapcraft Parts',
        'Snapcraft Syntax',
        'Debug',
        'Metadata',
        'Plugins'
      ])
    }
  }))
  .use(markdown({
    gfm: true
  }))
  .use(permalinks({
    pattern: ':title'
  }))
  .use(layouts({
    engine: 'nunjucks',
    default: 'base.html',
    directory: 'templates',
    pattern: '**/*.html'
  }))
  .use(blc({warn: true}))
  .use(msIf(
    opts.watch,
    watch({
      paths: {
        '${source}/**/*': '**/*',
        'templates/**/*': '**/*'
      }
    })))
  .build(function(err) {
    if (err) throw err;
    console.log('Build Completed.');
  });
