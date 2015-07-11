'use strict';

var path = require('path');
var relative = require('relative');
var utils = require('./utils');

/**
 * Create a new `File` from the given `object`.
 *
 * @param {Object} `object`
 * @api public
 */

function File(object) {
  this.history = [];
  this.pattern = object.pattern;
  this.recurse = object.recurse;
  this.dirname = object.dirname;
  this.segment = object.segment;
  this.path = object.path;
}

/**
 * Parse the `file.path` to add additional path properties
 * to the `file` object. This is used in the iterators
 * before the middleware handler is called.
 *
 * @param  {String} `cwd`
 */

File.prototype.parse = function(cwd) {
  cwd = cwd || process.cwd();

  this.relative = relative(cwd, this.path);
  this.absolute = path.resolve(this.path);
  this.basename = path.basename(this.relative);
  this.extname = path.extname(this.relative);

  if(this.path.charAt(0) === '/') {
    this.root = '/';
  }
};


/**
 * Expose `File`
 */

module.exports = File;
