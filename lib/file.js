'use strict';

function File(obj) {
  this.history = [];
  this.pattern = obj.pattern;
  this.recurse = obj.recurse;
  this.dirname = obj.dirname;
  this.segment = obj.segment;
  this.path = obj.path;
}

/**
 * Expose `File`
 */

module.exports = File;
