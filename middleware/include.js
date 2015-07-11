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

  return function include(file) {
    if (isMatch(file.path)) {
      file.include = true;
      return file;
    }

    if (file.pattern.hasParent()) {
      if (isMatch(file.relative) || file.pattern.re.test(file.segment)) {
        file.include = true;
        return file;
      }
    }

    if (file.pattern.matchDirs && file.isDirectory()) {
      console.log(file)
      // file.include = true;
    }
    return file;
  };
};
