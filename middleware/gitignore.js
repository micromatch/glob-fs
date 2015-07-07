'use strict';

var fs = require('fs');
var extend = require('extend-shallow');
var ignore = require('parse-gitignore');
var mm = require('micromatch');
var cache = {}, ref;

function parseGitignore(fp) {
  if (cache[fp]) return cache[fp];
  if (!fs.existsSync(fp)) return [];
  var str = fs.readFileSync(fp, 'utf8');
  return (cache[fp] = ignore(str));
}

module.exports = function (options) {
  options = extend({ contains: true }, options);
  var ignored = parseGitignore('.gitignore');
  var isMatch = ref || (ref = mm.matcher(ignored.join('|'), options));

  return function gitignore(file, opts) {
    opts = extend({}, options, opts);
    if (opts.gitignore === false) return file;

    if (isMatch(file.path)) {
      file.exclude = true;
    }
    return file;
  };
};
