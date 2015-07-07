'use strict';

function File(obj) {
  this.dirname = obj.dirname;
  this.segment = obj.segment;
  this.path = obj.path;
  this.stat = obj.stat;
}

/**
 * Expose `File`
 */

module.exports = File;
