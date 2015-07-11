'use strict';

/**
 * Module dependencies
 */

var omit = require('object.omit');
var visit = require('object-visit');
var extend = require('extend-shallow');
var Emitter = require('component-emitter');
var exclude = require('./middleware/exclude');
var include = require('./middleware/include');
var symlinks = require('./lib/symlinks');
var iterators = require('./lib/iterators');
var Handler = require('./lib/handler');
var Pattern = require('./lib/pattern');
var options = require('./lib/options');
var readers = require('./lib/readers');
var filter = require('./lib/filter');
var utils = require('./lib/utils');
var File = require('./lib/file');

/**
 * Optionally create an instance of `Glob` with the given `options`.
 *
 * ```js
 * var Glob = require('glob-fs').Glob;
 * var glob = new Glob();
 * ```
 *
 * @param {Object} `options`
 * @api public
 */

function Glob(options) {
  if (!(this instanceof Glob)) {
    return new Glob(options);
  }

  this.handler = new Handler(this);
  Emitter.call(this);
  this.init(options);
}

/**
 * Glob prototype methods.
 */

Glob.prototype = Emitter({

  /**
   * Initialize private objects.
   */

  init: function (opts) {
    this.options = opts || {};
    this.middleware = {};
    this.includes = {};
    this.excludes = {};
    this.files = [];
    this.fns = [];

    options(this);
    iterators(this);
    symlinks(this);
    readers(this);
    filter(this);
  },

  /**
   * Set configuration defaults.
   */

  defaults: function (glob, opts) {
    if (opts.ignore) {
      this.map('exclude', opts.ignore, opts);
    }
    if (opts.exclude) {
      this.map('exclude', opts.exclude, opts);
    }
    if (opts.include) {
      this.map('include', opts.include, opts);
    }

    if (opts.builtins === false) return;

    // turned `on` by default
    if (opts.dotfiles !== false) {
      this.use(require('glob-fs-dotfiles')(opts, this));
    }

    // turned `off` by default
    if (opts.gitignore !== true) {
      this.use(require('glob-fs-gitignore')(opts, this));
    }
  },

  /**
   * Create an instance of `Pattern` for the current glob pattern.
   *
   * @param {String} `pattern`
   * @param {Object} `options`
   */

  setPattern: function (pattern, options) {
    options = options || {};
    this.pattern = new Pattern(pattern, options);
    this.recurse = this.shouldRecurse(this.pattern, options);

    // if middleware are registered, use the glob, otherwise regex
    var glob = this.fns.length
      ? this.pattern.glob
      : this.pattern.re;

    this.defaults(glob, options);
    this.include(glob, options);
    return this;
  },

  /**
   * Create a file object with the given properties.
   *
   * @param  {String} `dir`
   * @param  {String} `segment`
   * @param  {String} `fp`
   * @param  {Object} `stat`
   * @return {Object}
   */

  // createFile: function (dir, segment, fp, stat) {
  createFile: function (file) {
    return new File({
      pattern: this.pattern,
      recurse: this.recurse,
      dirname: file.dirname,
      segment: file.segment,
      path: file.path
    });
  },

  /**
   * Return `true` if the iterator should recurse, based
   * on the given glob pattern and options.
   *
   * @param  {String} `pattern`
   * @param  {Object} `options`
   */

  shouldRecurse: function(pattern, options) {
    var opts = extend({}, this.options, options);
    if (typeof opts.recurse === 'boolean') {
      return opts.recurse;
    }
    return pattern.isGlobstar;
  },

  /**
   * Add a middleware to be called in the order defined.
   *
   * ```js
   * var gitignore = require('glob-fs-gitignore');
   * var dotfiles = require('glob-fs-dotfiles');
   * var glob = require('glob-fs')({ foo: true })
   *   .use(gitignore())
   *   .use(dotfiles());
   *
   * var files = glob.readdirSync('*.js');
   * ```
   *
   * @name .use
   * @param  {Function} `fn`
   * @return {Object} Returns the `Glob` instance, for chaining.
   * @api public
   */

  use: function(fn) {
    this.handler.use(fn);
    return this;
  },

  /**
   * Thin wrapper around `.use()` for easily excluding files or
   * directories that match the given `pattern`.
   *
   * ```js
   * var gitignore = require('glob-fs-gitignore');
   * var dotfiles = require('glob-fs-dotfiles');
   * var glob = require('glob-fs')({ foo: true })
   *   .exclude(/\.foo$/)
   *   .exclude('*.bar')
   *   .exclude('*.baz');
   *
   * var files = glob.readdirSync('**');
   * ```
   *
   * @name .exclude
   * @param  {String} `pattern`
   * @param  {Object} `options`
   * @api public
   */

  exclude: function(pattern, options) {
    var opts = extend({}, this.options, options);
    this.use(exclude(pattern, opts));
    return this;
  },

  /**
   * Include files or directories that match the given `pattern`.
   *
   * @name .include
   * @param  {String} `pattern`
   * @param  {Object} `options`
   */

  include: function(pattern, options) {
    var opts = extend({}, this.options, options);
    this.use(include(pattern, opts));
    return this;
  },

  /**
   * Optionally track the history of a file as it travels
   * through the middleware stack.
   *
   * @param  {Object} `file`
   */

  track: function(file) {
    if (this.options.track === true) {
      file.history.push(omit(file, 'history'));
    }
  },

  /**
   * Handle middleware.
   *
   * @param  {Object} `file`
   * @return {Object}
   */

  handle: function(file) {
    this.handler.handle(file);
    return this;
  },

  /**
   * Map the given `method` over `array`.
   *
   * @param  {String} `method`
   * @param  {Array} `arr`
   * @return {Object} `this` for chaining
   */

  map: function(method, arr/*, arguments*/) {
    var args = [].slice.call(arguments, 2);
    utils.arrayify(arr || []).forEach(function (obj) {
      this[method](obj, args);
    }.bind(this));
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
