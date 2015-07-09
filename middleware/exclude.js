'use strict';

var mm = require('micromatch');
var typeOf = require('kind-of');
var extend = require('extend-shallow');

module.exports = function (pattern, options) {
  var opts = extend({}, options);
  var type = typeOf(pattern);

  var isMatch = type === 'regexp'
    ? function (fp) {
      return pattern.test(fp);
    }
    : mm.matcher(pattern, opts);

  return function exclude(file) {
    if (isMatch(file.path)) {
      file.exclude = true;
      return file;
    }

    if (file.pattern.hasParent()) {
      if (isMatch(file.relative) || file.pattern.re.test(file.segment)) {
        file.exclude = true;
        return file;
      }
    }
    return file;
  };
};
