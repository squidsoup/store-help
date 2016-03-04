var Metalsmith = require('metalsmith');
var blc = require('metalsmith-broken-link-checker');

Metalsmith(__dirname)
    .use(markdown());
    .use(blc(options));
    .build(function(err) {
        if (err) throw err;
    });
