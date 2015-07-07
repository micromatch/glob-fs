'use strict';

/**
 * Module dependencies
 */

var Emitter = require('component-emitter');
var visit = require('object-visit');
var mapVisit = require('map-visit');
var get = require('get-value');
var union = require('union-value');

/**
 * Local dependencies
 */

var patterns = require('./lib/patterns');
var lookup = require('./lib/lookup');
var filter = require('./lib/filter');
var File = require('./lib/file');
var utils = require('./lib/utils');

/**
 * Create an instance of `Glob` with the given `patterns` and `options`.
 *
 * @param {String|Array} `patterns`
 * @param {Object} `options`
 */

function Glob(patterns, options) {
  Emitter.call(this);
  this.init(options);
  this.map('pattern', patterns);
  this.map('exclude', this.options.ignore);

  // Object.defineProperty(this, '_callbacks', {
  //   enumerable: false,
  //   configurable: true,
  //   writable: true,
  //   value: this._callbacks
  // });
}

/**
 * Glob prototype methods
 */

Glob.prototype = Emitter({
  constructor: Glob,

  init: function(options) {
    this.options = options || {};
    this.patterns = [];
    this.includes = [];
    this.excludes = [];
    this.dirs = [];
    this.tree = {};
    this.cache = {};
    this.files = [];
    lookup(this);
    patterns(this);
    filter(this);
  },

  file: function(file) {
    this.files.push(new File(file));
    return this;
  },

  dir: function(file) {
    this.dirs.push(new File(file));
    return this;
  },

  leaf: function(dir, file) {
    return this.union(['tree', dir], new File(file));
  },

  union: function(prop, value) {
    union(this, utils.arrayify(prop).join('.'), value);
    return this;
  },

  /**
   * Map the given `method` over `array`.
   *
   * @param  {String} `method`
   * @param  {Array} `arr`
   * @return {Object} `this` for chaining
   */

  map: function(method, arr, options) {
    return utils.arrayify(arr || []).map(function (ele) {
      return this[method].call(this, ele, options);
    }.bind(this));
  },

  /**
   * Call the given method on each value in `obj`.
   */

  mapVisit: function (method, arr) {
    return mapVisit(this, method, arr);
  },

  /**
   * Call the given method on each value in `obj`.
   */

  visit: function (method, obj) {
    visit(this, method, obj);
    return this;
  },

  /**
   * Add a method to the Glob prototype
   */

  mixin: function (name, fn) {
    Glob.prototype[name] = fn;
  }
});

var glob = new Glob(['node_modules/assemble/*.js'], {ignore: []});

// glob.on('include', function (val) {
//   // console.log(val)
// });

// glob.on('file', function (file) {
//   // console.log(file)
// });

// glob.on('leaf', function (dir, file) {
//   console.log(dir, file)
// });

// glob.on('dir', function (file) {
//   console.log(file)
// });

// glob.include('mocha/**', {cwd: 'node_modules'});
// glob.include('node_modules/assemble/*.js');

// glob.exclude('!**/*.{js,json}', {cwd: 'test/fixtures/'});
// glob.exclude('!**/.*');
// glob.exclude('!.*');
// glob.exclude('supports/*');
// glob.exclude('package.json');
// glob.exclude('txt');
// glob.exclude(['.txt', '.less']);
// glob.exclude(['.json', '.js']);
// glob.exclude('.*');
// glob.exclude('.txt');
// glob.exclude('.md');
// glob.exclude('LICENSE');
// glob.exclude('license');

// glob.walkEach(['node_modules', '.']);
// console.log(glob.excludes);

// glob.recurse = false;
glob.search();
console.log(glob);

/**
 * Expose `Glob`
 */

module.exports = Glob;
