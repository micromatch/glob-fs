'use strict';

var relative = require('relative');
var utils = require('./utils');

/**
 * Lazily required modules
 */

var lazy = require('lazy-cache')(require);
var parsePath = lazy('parse-filepath');
var extend = lazy('extend-shallow');
var isDotfile = lazy('is-dotfile');
var isDotdir = lazy('is-dotdir');

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
  utils.defineProp(this, 'cache', new Map());

  cwd = cwd || process.cwd();
  var first = this.path.charAt(0);
  if (first === '/') {
    this.root = '/';
  }

  this.relative = relative(cwd, this.path);
  extend()(this, parsePath()(this.path));

  this.isDotfile = function (fp) {
    return isDotfile()(fp || this.relative);
  };

  this.isDotdir = function (fp) {
    return isDotdir()(fp || this.relative);
  };
};

/**
 * Expose `File`
 */

module.exports = File;
