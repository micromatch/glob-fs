'use strict';

var path = require('path');
var typeOf = require('kind-of');
var isGlob = require('is-glob');
var utils = require('./utils');

/**
 * Lazily required modules
 */

var lazy = require('lazy-cache')(require);
var startsWith = lazy('starts-with');
var endsWith = lazy('ends-with');
var parent = lazy('glob-parent');
var mm = lazy('micromatch');

/**
 * Create an instance of `Pattern` with the given `options`.
 *
 * @param {String} `glob`
 * @param {Object} `options`
 * @param {Boolean} `isNegated`
 * @api public
 */

function Pattern(glob, options, isNegated) {
  utils.defineProp(this, 'cache', new Map());
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
  this.cwd = path.resolve(this.options.cwd || '.');

  if (this.endsWith('/', pattern)) {
    this.matchDirs = true;
  }

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
    this.parent = parent()(pattern);
    this.base = path.join(this.cwd, this.parent);
    pattern = this.normalizePattern(pattern);
  }

  this.toRegex(pattern);
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
  sep = new RegExp('^' + sep);

  pattern = pattern.replace(sep, '');
  if (this.startsWith('/', pattern)) {
    pattern = pattern.slice(1);
    this.root = '/';
  }

  this.glob = pattern;
  return pattern;
};

/**
 * Return `true` if the given `pattern` ends with the given
 * `character`
 *
 * @param  {String} `character`
 * @param  {String} `pattern` If no `pattern` is passed, the cached glog is used.
 */

Pattern.prototype.endsWith = function(ch, pattern) {
  var key = 'endsWith:' + ch;
  if (this.cache.has(key)) return this.cache.get(key);

  if (typeof pattern === 'undefined') {
    pattern = this.pattern ? this.pattern.glob : this.original;
  }

  var res = endsWith()(pattern, ch);
  this.cache.set(key, res);
  return res;
};

/**
 * Return `true` if the given `pattern` starts with the given
 * `character`
 *
 * @param  {String} `character`
 * @param  {String} `pattern` If no `pattern` is passed, the cached glog is used.
 */

Pattern.prototype.startsWith = function(ch, pattern) {
  var key = 'startsWith:' + ch;
  if (this.cache.has(key)) return this.cache.get(key);

  if (typeof pattern === 'undefined') {
    pattern = this.pattern ? this.pattern.glob : this.original;
  }

  var res = startsWith()(pattern, ch);
  this.cache.set(key, res);
  return res;
};

/**
 * Return `true` if an actual parent was extracted from
 * the glob pattern. e.g. not `.`
 *
 * @param  {String} `parent`
 */

Pattern.prototype.hasParent = function() {
  if (this.parent !== '.' && this.parent.length > 0) {
    return true;
  }
  if (this.cwd !== '.' && this.cwd.length > 0) {
    return true;
  }
  return false;
};

/**
 * Convert `pattern` to regex.
 *
 * @param  {String} `str`
 * @return {String}
 */

Pattern.prototype.toRegex = function(pattern) {
  if (typeOf(this.re) === 'regexp') return;

  if (!pattern && this.negated) {
    this.re = new RegExp(this.parent);
  } else {
    this.re = mm().makeRe(pattern);
  }

  if (!this.re) {
    console.log(this.re)
    this.re = new RegExp(this.original);
  }
};

/**
 * Expose `Pattern`
 */

module.exports = Pattern;
