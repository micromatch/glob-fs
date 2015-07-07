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

/**
 * Unignore a previously-ignored file.
 *
 * @param  {String} `pattern`
 * @return {Object}
 */

module.exports.exclude = function (pattern) {
  for (var key in this.excludes) {
    if (mm.isMatch(key, pattern)) {
      this.includes[key] = this.excludes[key];
      this.files.push(key);
      delete this.excludes[key];
      break;
    }
  }
  return this;
};
