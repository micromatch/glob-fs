'use strict';

var fs = require('fs');
var isGlob = require('is-glob');
var extend = require('extend-shallow');
var ignore = require('parse-gitignore');
var mm = require('micromatch');
var mini = require('minimatch');
var cache = {};


function gitignore(fp) {
  if (cache[fp]) return cache[fp];
  if (!fs.existsSync(fp)) return [];
  var str = fs.readFileSync(fp, 'utf8');
  return (cache[fp] = ignore(str));
}

exports.gitignore = function (options) {
  var ignored = gitignore('.gitignore');
  var isMatch = mm.matcher(ignored.join('|'), {contains: true});

  return function (file, opts, next) {
    opts = extend({}, options, opts);
    if (opts.gitignore === false) {
      return next(null, file);
    }
    if (isMatch(file.path)) {
      file.exclude = true;
    }
    next(null, file);
  };
};
