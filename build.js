'use strict';

const Metalsmith = require('metalsmith');
const blc = require('metalsmith-broken-link-checker');
const branch = require('metalsmith-branch');
const collections = require('metalsmith-collections');
const drafts = require('metalsmith-drafts');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const moment = require('moment');
const msIf = require('metalsmith-if');
const nunjucks = require('nunjucks');
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
  .ignore(['.*.swp'])
  .use(rootPath())
  .use(drafts())
  .use(collections({
    guides: {
      pattern: 'content/guides/*.md',
      metadata: {
        name: 'Guides'
      }
    },
    snapcraft: {
      pattern: 'content/snapcraft/*.md',
      metadata: {
        name: 'Snapcraft'
      },
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
    gfm: true,
    langPrefix: 'hl',
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value;
    }
  }))
  .use(
    branch(['!index.html'])
    .use(permalinks({
      pattern: ':title',
      relative: false
    }))
  )
  .use(layouts({
    engine: 'nunjucks',
    default: 'index.html',
    directory: 'templates',
    pattern: '**/*.html',
    moment: moment
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
