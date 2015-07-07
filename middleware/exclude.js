'use strict';

var mm = require('micromatch');
var typeOf = require('kind-of');
var extend = require('extend-shallow');
var isnt = require('./isnt');

module.exports = function (pattern, options) {
  var opts = extend({ matchBase: true }, options);

  var isMatch = typeOf(pattern) === 'regexp'
    ? isnt(pattern)
    : mm.matcher(pattern, opts);

  return function exclude(file) {
    if (isMatch(file.path)) {
      file.exclude = true;
    }
    return file;
  };
};
