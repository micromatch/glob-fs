'use strict';

var fs = require('fs');
var path = require('path');
var lazy = require('lazy-cache')(require);
var async = lazy('async');
var through = lazy('through2');
var promise = lazy('bluebird');

module.exports = function (app) {
  app.visit('mixin', {
    count: 0,

    iteratorAsync: function(dir, cb) {
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

          async().each(files, function(segment, next) {
            var fp = path.join(dir, segment);

            fs.stat(fp, function(err, stat) {
              if (err) return next(err);

              var isDir = stat.isDirectory();
              var isSym = stat.isSymbolicLink();
              var file = self.createFile(dir, segment, fp, stat);
              file.isSymlink = isSym;
              file.isDir = isDir;

              // handle middleware
              self.handle(file);

              if (isDir) {
                self.emit('dir', file);
              }

              if (file.exclude === true) {
                self.emit('exclude', file);
                self.excludes[file.path] = file;
                return next();
              }

              if (file.include === true) {
                self.count++;
                self.emit('include', file);
                self.includes[file.path] = file;
                self.files.push(fp);
              }

              if (file.recurse !== false && isDir && !isSym) {
                return walk(fp, next);
              }
              next();
            });
          }, cb);
        });
      }
      return this;
    },

    iteratorSync: function(dir) {
      var files = fs.readdirSync(dir);
      var len = files.length, i = -1;

      while (++i < len) {
        var segment = files[i];
        var fp = path.join(dir, segment);
        var stat = fs.lstatSync(fp);

        var isDir = stat.isDirectory();
        var file = this.createFile(dir, segment, fp, stat);
        file.isDir = isDir;

        // handle middleware
        this.emit('file', file);
        this.handle(file);

        if (isDir) {
          this.emit('dir', file);
        }

        if (file.include === true) {
          this.count++;
          this.emit('include', file);
          this.includes[file.path] = file;
          this.files.push(fp);
        }

        if (file.exclude === true) {
          this.emit('exclude', file);
          this.excludes[file.path] = file;
          continue;
        }

        if (file.recurse !== false && isDir) {
          this.iteratorSync(fp);
        }
      }
      return this;
    },

    iteratorStream: function(dir) {
      var self = this;
      var stream = through().obj();
      var pass = through().obj();

      fs.exists(dir, function(exists) {
        if (!exists) return;

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
          }

          async().each(files, function(segment, next) {
            var fp = path.join(dir, segment);

            fs.stat(fp, function(err, stat) {
              if (err) return next(err);

              var isDir = stat.isDirectory();
              var file = self.createFile(dir, segment, fp, stat);
              file.isDir = isDir;

              // handle middleware
              self.handle(file);

              if (isDir) {
                self.emit('dir', file);
              }

              if (file.exclude === true) {
                self.emit('exclude', file);
                return next();
              }

              if (file.include === true) {
                self.count++;
                self.emit('include', file);
                stream.write(file);
              }

              if (file.recurse !== false && isDir) {
                return walk(fp, next);
              }
              next();
            });
          }, cb);
        });
      }
      stream = stream.pipe(pass);
      return stream;
    },

    iteratorPromise: function(dir) {
      var Promise = promise();
      var readdir = Promise.promisify(fs.readdir);
      var stats = Promise.promisify(fs.lstat);
      var self = this;

      return readdir(dir).map(function (segment) {
        var fp = path.join(dir, segment);

        return stats(fp)
          .then(function (stat) {
            var isDir = stat.isDirectory();
            var file = self.createFile(dir, segment, fp, stat);
            file.isDir = isDir;

            // handle middleware
            self.emit('file', file);
            self.handle(file);

            if (isDir) {
              self.emit('dir', file);
            }

            if (file.include === true) {
              self.count++;
              self.emit('include', file);
              self.includes[file.path] = file;
              self.files.push(fp);
            }

            if (file.exclude === true) {
              self.emit('exclude', file);
              self.excludes[file.path] = file;
              return fp;
            }

            if (file.recurse !== false && isDir) {
              return self.iteratorPromise(fp);
            }
            return fp;
          });
      })

      .reduce(function (acc, files) {
        return acc.concat(files);
      }, []);
    },

  });
};
