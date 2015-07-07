'use strict';

var dotfiles = require('../middleware/dotfiles');
var glob = require('..');

/**
 * Example middleware for ignoring everything in
 * the `./tests/` directory
 */

function tests(options) {
  return function(file) {
    if (/^test\//.test(file.dirname)) {
      file.exclude = true;
    }
    return file;
  };
}

glob({ gitignore: true })
  .use(dotfiles()) // <= 'dotfiles' middleware
  .use(tests()) // <= 'tests' middleware
  .readdir('**/*.js', function (err, files) {
    if (err) return console.error(err);
    console.log(files);
  });
