'use strict';

const Metalsmith = require('metalsmith');
const blc = require('metalsmith-broken-link-checker');
const branch = require('metalsmith-branch');
const collections = require('metalsmith-collections');
const drafts = require('metalsmith-drafts');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const moment = require('moment');
const nunjucks = require('nunjucks');
const permalinks  = require('metalsmith-permalinks');
const rootPath = require('metalsmith-rootpath');

const sorter = require('./sorter').sorter;

nunjucks.configure('./templates', {watch: false});

module.exports = function(callback) {
  Metalsmith(__dirname)
  .clean(false) // leave for gulp
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
  .build(function(err) {
    if (err) {
      throw new Error(err);
    } else {
      return callback(); // let gulp run async
    }
  });
};
