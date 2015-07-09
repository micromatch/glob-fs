'use strict';

var path = require('path');
var relative = require('relative');

function File(obj) {
  this.history = [];
  this.pattern = obj.pattern;
  this.recurse = obj.recurse;
  this.dirname = obj.dirname;
  this.segment = obj.segment;
  this.path = obj.path;
}

File.prototype.parse = function(dir) {
  dir = dir || process.cwd();
  this.absolute = path.resolve(this.path);
  this.relative = relative(dir, this.path);
};


/**
 * Expose `File`
 */

module.exports = File;
