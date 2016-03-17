'use strict';

const fm = require('../frontmatterise')
const fs = require('fs');
const temp = require('temp').track()

describe('frontmatterise', function() {
  it('generates frontmatter correctly', function() {
    let frontmatter = fm.generateFrontmatter('great-documentation');
    let expected = '---\ntitle: Great Documentation\n---\n\n';
    expect(expected).toEqual(frontmatter);
  });

  describe('when parsing a collection of files', function() {

    let result = '';

    beforeEach(function(done) {
      let fileData = '\n#A Markdown Heading\n';
      let files = [];
      temp.open('frontmatter_test_', function(err, info) {
        files.push(info.path)
        if (!err) {
          fs.write(info.fd, fileData, function() {
            fm.annotateFiles(files, function() {
              fs.readFile(files[0], 'utf-8', function(err, data) {
                result = data;
                temp.cleanup();
                done();
              });
            })
          });
        }
      });
    });

    it('should correctly prepend frontmatter to file', function() {
      expect(result).toContain('title: Frontmatter Test');
    });
  });

});

