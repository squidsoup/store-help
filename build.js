var Metalsmith = require('metalsmith');
var blc = require('metalsmith-broken-link-checker');
var collections = require('metalsmith-collections');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');

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
  .build(function(err) {
    if (err) throw err;
    console.log('Build Completed.');
  });
