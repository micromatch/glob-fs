'use strict';

var fs = require('fs');
var path = require('path');
var typeOf = require('kind-of');
var mm = require('micromatch');
var File = require('./lib/file');
var Emitter = require('component-emitter');
var Pattern = require('./lib/pattern');
var utils = require('./lib/utils');

function Glob(pattern, options) {
  Emitter.call(this);
  if (typeOf(pattern) === 'object') {
    options = pattern;
    pattern = null;
  }
  this.options = options || {};
  this.setPattern(pattern, this.options);
  this.init(pattern, this.options);
}

Glob.prototype = Emitter({
  init: function (pattern, options) {
    this.ignored = [];
    this.files = [];
    this.list = [];
    this.fns = [];

    if (options.exclude) {
      this.map('exclude', options.exclude, options);
    }
  },

  setPattern: function (pattern, options) {
    this.pattern = new Pattern(pattern, options);
    if (typeof this.options.recurse === 'undefined') {
      this.recurse = this.pattern.isGlobstar;
    } else {
      this.recurse = this.options.recurse;
    }
    return this;
  },

  createFile: function (dir, segment, fp, stat) {
    return new File({
      path: fp,
      dirname: dir,
      recurse: this.recurse,
      segment: segment,
      stat: stat
    });
  },

  lookupSync: function(dir) {
    var files = fs.readdirSync(dir);
    var len = files.length, i = -1;

    while (++i < len) {
      var segment = files[i];
      var fp = path.join(dir, segment);
      var stat = fs.lstatSync(fp);

      var isDir = stat.isDirectory();
      var file = this.createFile(dir, segment, fp, stat);
      this.run(file);

      if (isDir) {
        this.emit('dir', file);
      }
      if (file.exclude === true) {
        this.emit('exclude', file);
      }
      if (file.include === true) {
        this.emit('include', file);
      }

      if (file.exclude !== true) {
        if (file.include === true) {
          this.files.push(file);
          this.list.push(fp);
        }
        if (file.recurse !== false && isDir) {
          this.lookupSync(fp);
        }
      } else {
        this.ignored.push(file);
      }
    }
    return this;
  },

  readdirSync: function(pattern, options) {
    this.setPattern(pattern, options);
    this.lookupSync(this.pattern.base);
    return this;
  },

  use: function(fn) {
    this.fns.push(fn);
    return this;
  },

  exclude: function(pattern, options) {
    var include = mm.matcher(pattern, options);

    this.use(function (file) {
      if (include(file.path)) {
        file.exclude = true;
      }
      return file;
    });
  },

  unignore: function(pattern, options) {

  },

  run: function(file) {
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

var glob = new Glob({ gitignore: false });

// glob.exclude('*.txt', {matchBase: true});
// glob.exclude('*.js', {matchBase: true});
var middleware = require('./middleware');
// var mini = require('minimatch');

glob.on('file', function (file) {
  console.log('file', file.path)
});

glob.on('exclude', function (file) {
  if (/glob\.js/.test(file.path)) {
    file.exclude = false;
  }
  console.log('exclude', file.path)
});

glob
  .use(middleware.gitignore())
  .use(function (file) {
    if (/^node_modules/.test(file.path)) {
      file.exclude = true;
    }
    return file;
  })
  .use(match);

function match (file) {
  file.include = mm.isMatch(file.path, this.pattern.glob);
  return file;
}


console.time('glob')
glob.exclude('glob.js');
glob.readdirSync('**/*.js');
console.log(glob.list)
console.timeEnd('glob')
console.log(glob.files.length);

// var globby = require('globby');
// console.time('globby');
// var globbies = globby.sync('**/*');
// console.timeEnd('globby');
// console.log(globbies.length);
// // console.log(globbies);
