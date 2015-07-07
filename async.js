'use strict';

var fs = require('fs');
var path = require('path');
var typeOf = require('kind-of');
var mm = require('micromatch');
var async = require('async');
var File = require('./lib/file');
var Pattern = require('./lib/pattern');
var utils = require('./lib/utils');

function Glob(pattern, options) {
  if (typeOf(pattern) === 'object') {
    options = pattern;
    pattern = null;
  }
  this.options = options || {};
  this.setPattern(pattern, this.options);
  this.init(pattern, this.options);
  return this;
}

Glob.prototype = {
  init: function (pattern, options) {
    this.ignored = [];
    this.files = [];
    this.list = [];
    this.fns = [];

    if (options.ignore) {
      this.map('ignore', options.ignore, options);
    }
  },

  setPattern: function (pattern, options) {
    this.pattern = new Pattern(pattern, options);
    this.recurse = this.pattern.isGlobstar;
    return this;
  },

  createFile: function (dir, segment, fp, stat) {
    return new File({
      path: fp,
      dirname: dir,
      segment: segment,
      stat: stat
    });
  },

  iterate: function(dir, cb) {
    var self = this;

    fs.exists(dir, function(exists) {
      if (!exists) {
        return cb(null, []);
      }
      return walk(dir, cb);
    });

    function walk(dir, cb) {
      fs.readdir(dir, function(err, files) {
        if (err) return cb(err);

        async.each(files, function(fp, next) {
          var segment = fp;
          fp = path.join(dir, segment);


          fs.stat(fp, function(err, stat) {
            if (err) return next(err);

            var file = self.createFile(dir, segment, fp, stat);
            self.run(file, function (err) {
              if (err) return next(err);

              if (file.ignore !== true) {
                if (file.isMatch === true) {
                  self.files.push(file);
                  self.list.push(fp);
                }

                if (self.recurse !== false && stat.isDirectory()) {
                  return walk(fp, next);
                }
              } else {
                self.ignored.push(file);
              }

              next();
            });
          });
        }, cb);
      });
    }

    return this;
  },

  readdir: function(pattern, options, cb) {
    if (typeof options === 'function') {
      return this.readdir(pattern, {}, options);
    }
    this.setPattern(pattern, options);
    this.iterate(this.pattern.base, cb.bind(this));
    return this;
  },

  use: function(fn) {
    this.fns.push(fn);
    return this;
  },

  ignore: function(pattern, options) {
    var isMatch = mm.matcher(pattern, options);

    this.use(function (file, options, next) {
      if (isMatch(file.path)) {
        file.ignore = true;
      }
      next(null, file);
    });
  },

  unignore: function(pattern, options) {

  },

  run: function(file, cb) {
    async.eachSeries(this.fns, function (fn, next) {
      fn.call(this, file, this.options, next);
    }.bind(this), cb);
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
  }
};

var glob = new Glob({ gitignore: false });
var fns = require('./asyncFns');

// glob.ignore('*.txt', {matchBase: true});
// glob.ignore('*.js', {matchBase: true});
// var mini = require('minimatch');

glob
  .use(fns.gitignore())
  .use(function (file, options, next) {
    if (/(^\.|\/\.)/.test(file.path)) {
      file.ignore = true;
      return next()
    }
    next(null, file);
  })
  .use(function (file, options, next) {
    file.isMatch = mm.isMatch(file.path, this.pattern.glob);
    next(null, file);
  });



console.time('glob')
glob.readdir('**/*', function (err, files) {
  console.timeEnd('glob')
  if (err) return console.error(err);
  console.log(this.files.length);

  var globby = require('globby');
  console.time('globby');
  globby('**/*', function (err, files) {
    console.timeEnd('globby');
    if (err) return console.error(err);
    console.log(files.length);
  });
});





