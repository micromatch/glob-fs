'use strict';

var mm = require('micromatch');
var extend = require('extend-shallow');

module.exports = function (pattern, options) {
  var isMatch = mm.matcher(pattern, options);

  return function exclude(file, opts) {
    opts = extend({}, opts, options);

    file.exclude = isMatch(file.path, opts);
    return file;
  };
};
