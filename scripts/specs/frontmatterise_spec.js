'use strict';

const async = require('async');
const fs = require('fs');
const temp = require('temp').track();

const fm = require('../frontmatterise');

describe('frontmatterise', function() {
  it('generates frontmatter correctly', function() {
    let frontmatter = fm.generateFrontmatter('great-documentation');
    let expected = '---\ntitle: Great Documentation\n---\n\n';
    expect(expected).toEqual(frontmatter);
  });

  it('generates frontmatter with optional keys', function() {
    let options = {'layout': 'layout.html', 'foo': 'bar'};
    let frontmatter = fm.generateFrontmatter('a-file', options);
    let expected = '---\ntitle: A File\nlayout: layout.html\nfoo: bar\n---\n\n';
    expect(expected).toEqual(frontmatter);
  });

  describe('when parsing a collection of files', function() {
    let result = '';

    beforeEach(function(done) {
      let fileData = '\n#A Markdown Heading\n';
      let files = [];

      async.waterfall([
        // create a temporary file for tests
        function(callback){
          temp.open('frontmatter_test_', callback);
        },
        // write temp file contents
        function(info, callback) {
          files.push(info.path)
          fs.write(info.fd, fileData, callback);
        },
        // annotate temp file
        function(written, string, callback) {;
          fm.annotateFiles(files, {}, callback);
        },
        // read annotated file contents
        function(callback) {
          fs.readFile(files[0], 'utf-8', callback);
        }
      ], function(err, data) {
        result = data;
        temp.cleanup();
        done();
      });
    });

    it('should correctly prepend frontmatter to file', function() {
      expect(result).toContain('title: Frontmatter Test');
    });
  });

});
