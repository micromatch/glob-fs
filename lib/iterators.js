'use strict';

var fs = require('fs');
var path = require('path');
var lazy = require('lazy-cache')(require);
var async = lazy('async');
var through = lazy('through2');
var promise = lazy('bluebird');

module.exports = function (app) {
  app.visit('mixin', {

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
              var file = self.createFile(dir, segment, fp, stat);
              self.handle(file);

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
                  return walk(fp, next);
                }
              } else {
                this.ignored.push(file);
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
        this.handle(file);

        if (isDir) {
          this.emit('dir', file);
        }

        if (file.exclude === true) {
          this.emit('exclude', file);
          this.ignored.push(file);
          continue;
        }

        if (file.include === true) {
          this.emit('include', file);
          this.files.push(file);
          this.list.push(fp);
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

          async.each(files, function(segment, next) {
            var fp = path.join(dir, segment);

            fs.stat(fp, function(err, stat) {
              if (err) return next(err);

              var file = self.createFile(dir, segment, fp, stat);
              self.handle(file);

              var isDir = stat.isDirectory();
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
                if (file.include === true) {
                  stream.write(file);
                }
                if (self.recurse !== false && isDir) {
                  return walk(fp, next);
                }
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
      var stats = Promise.promisify(fs.stat);

      return readdir(dir).map(function (segment) {
        var fp = path.join(dir, segment);

        return stats(fp).then(function (stat) {
          if (stat.isDirectory()) {
            return this.iteratorPromise(fp);
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
