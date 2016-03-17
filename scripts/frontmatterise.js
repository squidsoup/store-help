#!/usr/bin/env node

'use strict';

const changeCase = require('change-case');
const prependFile = require('prepend-file');
const walk = require('walk');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

let files = [];

function generateFrontmatter(filename) {
  let title = changeCase.titleCase(filename.replace(/-/g, ' '));
  return `---\ntitle: ${title}\n---\n\n`;
}

function annotateFiles(files, callback) {
  for (let file of files) {
    let basename = path.parse(path.basename(file)).name;
    let frontmatter = generateFrontmatter(basename);
    prependFile(file, frontmatter, function(err) {
      if (err) {
        console.error('[ERROR] ' + err);
      }
      typeof callback === 'function' && callback();
    });
  }
}

function fileHandler(root, stat, next) {
  let filePath = path.resolve(root, stat.name);
  fs.readFile(filePath, function () {
    if (stat.name.endsWith('md')) {
      files.push(filePath);
    }
    next();
  });
}

function errorsHandler(root, nodeStatsArray, next) {
  nodeStatsArray.forEach(function (n) {
    console.error('[ERROR] ' + n.name);
    console.error(n.error.message || (n.error.code + ": " + n.error.path));
  });
  next();
}

if (require.main === module) {
  let argv = yargs
               .usage('Usage: $0 --path path_to_markdown_files_to_frontmatterise')
               .demand('path')
               .argv;
  let walker = walk.walk(argv.path, { followLinks: false });

  walker.on('file', fileHandler);
  walker.on('errors', errorsHandler);
  walker.on('end', function() {
    annotateFiles(files);
    console.log('Done.');
  })
}


module.exports = {
  generateFrontmatter: generateFrontmatter,
  annotateFiles: annotateFiles
}
