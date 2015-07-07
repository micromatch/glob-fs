'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

module.exports = function (app) {
  app.visit('mixin', {

    walk: function(pattern, res, parent) {
      var dir = pattern.cwd || pattern.parent;
      var files = utils.tryReaddir(dir);
      var len = files.length, i = -1;

      while (++i < len) {
        var segment = files[i];
        if (this.isExcluded(segment)) continue;

        var fp = path.join(dir, segment);
        if (this.isExcluded(fp)) continue;

        var stat = fs.lstatSync(fp);
        var file = {dirname: dir, segment: segment, path: fp, stat: stat};

        if (stat.isDirectory()) {
          this.emit('dir', file);
          this.dir(file);
          this.tree[fp] = [];

          if (this.recurse !== false) {
            parent = fp;
            pattern.cwd = fp
            this.walk(pattern, res, parent);
          }

        } else if (this.isIncluded(fp)) {
          var current = parent || dir;
          this.leaf(current, file);
          this.emit('leaf', current, file);
          this.emit('file', file);
          this.file(file);
        }
      }
      return this;
    },

    walkEach: function(dirs) {
      this.map('walk', dirs);
      return this;
    },

    search: function(patterns) {
      if (patterns) this.map('pattern', patterns);
      return this.walkEach(this.includes);
    }
  });
};
