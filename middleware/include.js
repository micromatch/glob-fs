'use strict';

var mm = require('micromatch');
var typeOf = require('kind-of');
var extend = require('extend-shallow');
var is = require('./is');

module.exports = function (pattern, options) {
  var opts = extend({ matchBase: true }, options);

  var isMatch = typeOf(pattern) === 'regexp'
    ? function (fp) {
      return pattern.test(fp);
    }
    : mm.matcher(pattern, opts);

  return function include(file) {
    if (isMatch(file.path)) {
      file.include = true;
    }
    return file;
  };
};
