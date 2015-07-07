'use strict';

var mm = require('micromatch');
var extend = require('extend-shallow');

module.exports = function (pattern, options) {
  var opts = extend({ matchBase: true }, options);
  var isMatch = mm.matcher(pattern, opts);

  return function unignore(file) {
    if (isMatch(file.path)) {
      delete file.exclude;
      file.include = true;
    }
    return file;
  };
};
