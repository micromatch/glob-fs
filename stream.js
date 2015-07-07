'use strict';

var fs = require('fs');
var path = require('path');
var typeOf = require('kind-of');
var mm = require('micromatch');
var async = require('async');
var Emitter = require('component-emitter');
var through = require('through2');
var File = require('./lib/file');
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
  return this;
}

Glob.prototype = Emitter({
  init: function (pattern, options) {
    this.excluded = [];
    this.files = [];
    this.list = [];
    this.fns = [];

    if (options.exclude) {
      this.map('exclude', options.exclude, options);
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

  lookup: function(dir) {
    var self = this;
    var stream = through.obj();
    var pass = through.obj();

    fs.exists(dir, function(exists) {
      if (!exists) {
        return;
      }
      walk(dir, function (err) {
        if (err) {
          stream.emit('error', err);
          return;
        }
        stream.end();
      });
    });

    function walk(dir, cb) {
      fs.readdir(dir, function(err, files) {
        if (err) {
          stream.emit('error', err);
          return;
        };

        async.each(files, function(fp, next) {
          var segment = fp;
          fp = path.join(dir, segment);

          fs.stat(fp, function(err, stat) {
            if (err) return next(err);

            var isDir = stat.isDirectory();
            var file = self.createFile(dir, segment, fp, stat);
            self.run(file, function (err) {
              if (err) return next(err);

              if (isDir) {
                self.emit('dir', file);
              }
              if (file.exclude === true) {
                self.emit('exclude', file);
              }
              if (file.include === true) {
                self.emit('include', file);
              }

              if (file.exclude !== true) {
                if (file.isMatch === true) {
                  stream.write(file);
                }

                if (self.recurse !== false && stat.isDirectory()) {
                  return walk(fp, next);
                }
              }
              next();
            });
          });
        }, cb);
      });
    }

    stream = stream.pipe(pass);
    return stream;
  },

  readdirStream: function(pattern, options) {
    if (typeof options === 'function') {
      return this.readdir(pattern, {}, options);
    }
    this.setPattern(pattern, options);
    return this.lookup(this.pattern.base);
  },

  use: function(fn) {
    this.fns.push(fn);
    return this;
  },

  exclude: function(pattern, options) {
    var isMatch = mm.matcher(pattern, options);

    this.use(function (file, options, next) {
      if (isMatch(file.path)) {
        file.exclude = true;
      }
      next(null, file);
    });
  },

  unexclude: function(pattern, options) {

  },

  run: function(file, cb) {
    async.eachSeries(this.fns, function (fn, next) {
      fn.call(this, file, this.options, function (err, file) {
        if (err) return next(err);
        next(null, file);
      });
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
});

var glob = new Glob({ gitignore: false });
var fns = require('./asyncFns');
// var Vinyl = require('vinyl');

// glob.exclude('*.txt', {matchBase: true});
// glob.exclude('*.js', {matchBase: true});
// var mini = require('minimatch');

glob
  .use(fns.gitignore())
  .use(function (file, options, next) {
    if (/(^\.|\/\.)/.test(file.path)) {
      file.exclude = true;
      return next();
    }
    next(null, file);
  })
  .use(function (file, options, next) {
    file.isMatch = mm.isMatch(file.path, this.pattern.glob);
    next(null, file);
  })

var globFiles = [];
console.time('glob');

glob.readdirStream('**/*')
  .on('data', function (file) {
    // file = new Vinyl(file)
    // console.log(file)
    globFiles.push(file);
    if (globFiles.length % 100 === 0) {
      console.log('glob', globFiles.length);
    }
  })
  .on('error', console.error)
  .on('end', function () {
    console.timeEnd('glob')
    console.log(globFiles.length);

    var files = [];
    var gulp = require('gulp');
    console.time('gulp');
    gulp.src('**/*', {read: false})
      .on('data', function (file) {
        files.push(file);
        if (files.length % 100 === 0) {
          console.log('gulp', files.length);
        }
      })
      .on('error', console.error)
      .on('end', function () {
        console.timeEnd('gulp');
        console.log(files.length);
      });
  });


// console.time('glob')
// glob.readdirStream('**/*', function (err, files) {
//   console.timeEnd('glob')
//   if (err) return console.error(err);
//   console.log(this.files.length);

//   var globby = require('globby');
//   console.time('globby');
//   globby('**/*', function (err, files) {
//     console.timeEnd('globby');
//     if (err) return console.error(err);
//     console.log(files.length);
//   });
// });





