var Metalsmith = require('metalsmith');
var blc = require('metalsmith-broken-link-checker');
var collections = require('metalsmith-collections');
var permalinks  = require('metalsmith-permalinks');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var msIf = require('metalsmith-if');
var watch = require('metalsmith-watch');
var rootPath = require('metalsmith-rootpath');
const sorter = require('./sorter').sorter;

var opts = {}
opts.watch = false;

var argv = require('yargs').argv;
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
  
