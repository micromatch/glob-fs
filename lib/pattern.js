'use strict';

var path = require('path');
var mm = require('minimatch');
var isGlob = require('is-glob');
var parent = require('glob-parent');

/**
 * Create an instance of `Pattern` with the given `options`.
 *
 * @param {String} `glob`
 * @param {Object} `options`
 * @param {Boolean} `isNegated`
 * @api public
 */

function Pattern(glob, options, isNegated) {
  this.negated = !!isNegated;
  this.options = options || {};
  this.parse(glob);
  return this;
}

/**
 * Parse `pattern` into an object.
 *
 * @param  {String} `pattern`
 * @return {Object}
 */

Pattern.prototype.parse = function(pattern) {
  this.original = pattern;

  pattern = pattern || '.';
  var cwd = this.options.cwd || '.';

  if (!isGlob(pattern)) {
    this.parent = '.';
    this.base = pattern;
    this.glob = pattern;

  } else {
    this.isGlobstar = pattern.indexOf('**') !== -1;
    if (pattern.charAt(0) === '!') {
      pattern = pattern.slice(1);
    this.negated = true;
  }
    this.parent = parent(pattern);
  this.base = path.join(cwd, this.parent);
    pattern = this.normalizePattern(pattern);
  }

  this.toRegex(this.glob);
  return this;
};

/**
 * Normalize slashes and dots in `pattern`.
 *
 * @param  {String} `str`
 * @return {String}
 */

Pattern.prototype.normalizePattern = function(pattern) {
  var sep = this.parent;
  if (sep === '.') sep = '';

  pattern = pattern.split(sep).filter(Boolean).join('');
  if (pattern.charAt(0) === '/') {
    pattern = pattern.slice(1);
  }

  this.glob = pattern;
  return pattern;
};

/**
 * Convert `pattern` to regex.
 *
 * @param  {String} `str`
 * @return {String}
 */

Pattern.prototype.toRegex = function(pattern) {
  if (!pattern && this.negated) {
    this.re = new RegExp(this.parent);
  } else {
    this.re = mm.makeRe(pattern);
  }
  if (!this.re) {
    this.re = new RegExp(this.original);
  }
};

/**
 * Expose `Pattern`
 */

module.exports = Pattern;
