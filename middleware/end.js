'use strict';

module.exports = function end(fn) {
  return this.files.filter(fn);
};
