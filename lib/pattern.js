'use strict';

var path = require('path');
var mm = require('minimatch');
var parent = require('glob-parent');

function Pattern(glob, options, isNegated) {
  this.negated = !!isNegated;
  this.options = options || {};
  this.parse(glob);
  return this;
}

Pattern.prototype.parse = function(glob) {
  glob = glob || '.';
  var cwd = this.options.cwd || '.';

  this.original = glob;
  this.isGlobstar = glob.indexOf('**') !== -1;

  if (glob.charAt(0) === '!') {
    this.negated = true;
    glob = glob.slice(1);
  }

  this.parent = parent(glob);
  this.base = path.join(cwd, this.parent);
  glob = this.getPattern(glob);

  this.glob = glob.charAt(0) === '/'
    ? glob.slice(1)
    : glob;

  this.toRegex(this.glob);
  return this;
};

Pattern.prototype.getPattern = function(str) {
  var sep = this.parent;
  if (sep === '.') sep = '';
  return str.split(sep)
    .filter(Boolean)
    .join('');
};

Pattern.prototype.toRegex = function(str) {
  if (!str && this.negated) {
    this.re = new RegExp(this.parent);
  } else {
    this.re = mm.makeRe(str);
  }
  if (!this.re) {
    this.re = new RegExp(this.original);
  }
};

/**
 * Expose `Pattern`
 */

module.exports = Pattern;
