'use strict';

var mm = require('micromatch');
var typeOf = require('kind-of');
var extend = require('extend-shallow');
var is = require('./is');

module.exports = function (pattern, options) {
  var opts = extend({}, options);
  var type = typeOf(pattern);

  var isMatch = type === 'regexp'
    ? function (fp) {
      return pattern.test(fp);
    }
    : mm.matcher(pattern, opts);

  return function include(file) {
    if (isMatch(file.path)) {
      file.include = true;
      return file;
    }

    if (file.pattern.hasParent()) {
      var full = file.pattern.relative(file.path);
      if (isMatch(full) || file.pattern.re.test(file.segment)) {
        file.include = true;
        return file;
      }
    }
    return file;
  };
};
