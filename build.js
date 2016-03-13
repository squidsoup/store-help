var Metalsmith = require('metalsmith');
var blc = require('metalsmith-broken-link-checker');
var collections = require('metalsmith-collections');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var msIf = require('metalsmith-if');
var watch = require('metalsmith-watch');


var opts = {}
opts.watch = false;

var argv = require('yargs').argv;
if (argv.watch == 'true') {
  opts.watch = argv.watch;
}

Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .use(markdown())
  .use(blc())
  .use(collections({
    Guides: {
      pattern: 'guides/*.md'
    },
    Api: {
      pattern: 'api/*.md'
    }
  }))
  .use(layouts({
    engine: 'handlebars'
  }))
  .use(msIf(
    opts.watch,
    watch({
    paths: {
      "${source}/**/*": true,
      "layouts/**/*": "**/*"
    }
  })))
  .build(function(err) {
    if (err) throw err;
    console.log('Build Completed.');
  });
