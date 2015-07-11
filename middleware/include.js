'use strict';

var mm = require('micromatch');
var typeOf = require('kind-of');
var extend = require('extend-shallow');

function testPattern(pattern) {
  return function (fp) {
    return pattern.test(fp);
  }
}

module.exports = function (pattern, options) {
  var opts = extend({}, options);
  var type = typeOf(pattern);

  var isMatch = type !== 'regexp'
    ? mm.matcher(pattern, opts)
    : testPattern(pattern);

  return function include(file) {
    if (file.pattern.hasTrailingSlash && file.isFile()) {
      return file;
    }

    if (isMatch(file.path)) {
      file.include = true;
      return file;
    }

    if (file.pattern.hasParent()) {
      if (isMatch(file.relative)) {
        file.include = true;
        return file;
      }

      if (file.pattern.test(file.segment) || file.pattern.test(file.relative)) {
        file.include = true;
        return file;
      }
    }
    return file;
  };
};
