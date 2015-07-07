'use strict';

/**
 * Module dependencies
 */

var visit = require('object-visit');
var mapVisit = require('map-visit');
var extend = require('extend-shallow');
var Emitter = require('component-emitter');
var exclude = require('./middleware/exclude');
var include = require('./middleware/include');

var File = require('./lib/file');
var iterators = require('./lib/iterators');
var Pattern = require('./lib/pattern');
var readdir = require('./lib/readdir');
var utils = require('./lib/utils');

/**
 * Create an instance of `Glob` with the given `options`.
 *
 * @param {Object} `options`
 * @api public
 */

function Glob(options) {
  if (!(this instanceof Glob)) {
    return new Glob(options);
  }
  Emitter.call(this);
  this.options = options || {};
  this.init(options);
  return this;
}

/**
 * Glob prototype methods.
 */

Glob.prototype = Emitter({

  /**
   * Initialize private objects.
   *
   * @param  {[type]} pattern [description]
   * @param  {[type]} options [description]
   * @return {[type]}
   */

  init: function (options) {
    this.ignored = [];
    this.files = [];
    this.list = [];
    this.fns = [];
    this.defaults(options);
    iterators(this);
    readdir(this);
  },

  defaults: function (opts) {
    if (opts.ignore) {
      this.map('exclude', opts.ignore, opts);
    }
    if (opts.exclude) {
      this.map('exclude', opts.exclude, opts);
    }
    if (opts.include) {
      this.map('include', opts.include, opts);
    }
  },

  setPattern: function (pattern, options) {
    this.pattern = new Pattern(pattern, options);
    this.recurse = this.shouldRecurse(this.pattern.glob, options);
    this.include(this.pattern.glob, options);
    return this;
  },

  createFile: function (dir, segment, fp, stat) {
    return new File({
      pattern: this.pattern,
      recurse: this.recurse,
      dirname: dir,
      segment: segment,
      stat: stat,
      path: fp
    });
  },

  /**
   * Return `true` if the iterator should recurse, based
   * on the given glob pattern and options.
   *
   * @param  {String} `pattern`
   * @param  {Object} `options`
   * @api public
   */

  shouldRecurse: function(pattern, options) {
    var opts = extend({}, this.options, options);
    if (typeof opts.recurse === 'boolean') {
      return opts.recurse;
    }
    return !!pattern.isGlobstar;
  },

  /**
   * Exclude files or directories that match the given `pattern`.
   *
   * @param  {String} `pattern`
   * @param  {Object} `options`
   * @api public
   */

  exclude: function(pattern, options) {
    var opts = extend({}, this.options, options);
    this.use(exclude(pattern, opts));
  },

  /**
   * Include files or directories that match the given `pattern`.
   *
   * @param  {String} `pattern`
   * @param  {Object} `options`
   * @api public
   */

  include: function(pattern, options) {
    var opts = extend({}, this.options, options);
    this.use(include(pattern, opts));
  },

  /**
   * Add a middleware to be called in the order defined.
   *
   * ```js
   * var glob = require('glob-fs')
   *   .use(require('glob-fs-foo'))
   *   .use(require('glob-fs-bar'))
   *
   * var files = glob.readdirSync('*.js');
   * ```
   *
   * @param  {Function} `fn`
   * @return {Object} Returns the `Glob` instance, for chaining.
   * @api public
   */

  use: function(fn) {
    this.fns.push(fn);
    return this;
  },

  /**
   * Handle middleware.
   *
   * @param  {Object} `file`
   * @return {Object}
   * @api public
   */

  handle: function(file) {
    var len = this.fns.length, i = -1;

    while (++i < len) {
      this.fns[i].call(this, file, this.options);
    }
  },

  /**
   * Map the given `method` over `array`.
   *
   * @param  {String} `method`
   * @param  {Array} `arr`
   * @return {Object} `this` for chaining
   */

  map: function(method, arr, options) {
    utils.arrayify(arr || []).forEach(function (ele) {
      this[method](ele, options);
    }.bind(this));
  },

  /**
   * Call the given method on each value in `obj`.
   */

  mapVisit: function (method, arr) {
    mapVisit(this, method, arr);
    return this;
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

/**
 * Expose `Glob`
 */

module.exports = Glob;
