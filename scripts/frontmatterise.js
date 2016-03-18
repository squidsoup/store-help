#!/usr/bin/env node

'use strict';

const changeCase = require('change-case');
const prependFile = require('prepend-file');
const walk = require('walk');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

let files = [];

function generateFrontmatter(filename, options) {
  const head = '---';
  const tail = '---\n\n';
  let title = 'title: ' + changeCase.titleCase(filename.replace(/-/g, ' '));

  if (options && Object.keys(options).length != 0) {
    let optionRows = [];
    Object.keys(options).forEach(function(key) {
      optionRows.push(`${key}: ${options[key]}`);
    });
    return [head, title, optionRows.join('\n'), tail].join('\n')
  }
  return [head, title, tail].join('\n')
}

function annotateFiles(files, options, callback) {
  for (let file of files) {
    let basename = path.parse(path.basename(file)).name;
    let frontmatter = generateFrontmatter(basename, options);
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
             .usage('Usage: $0 --path path_to_markdown_files_to_frontmatterise --layout layout_file')
             .demand('path')
             .argv;
  let walker = walk.walk(argv.path, { followLinks: false });
  let options = {}

  if (argv.layout) {
    options['layout'] = argv.layout
  }
  walker.on('file', fileHandler);
  walker.on('errors', errorsHandler);
  walker.on('end', function() {
    annotateFiles(files, options);
    console.log('Done.');
  })
}


module.exports = {
  generateFrontmatter: generateFrontmatter,
  annotateFiles: annotateFiles
}
