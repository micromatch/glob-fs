'use strict';

var mm = require('minimatch');

module.exports = function (app) {
  app.visit('mixin', {

    restore: function () {
      this.get('orig');
      return this;
    },

    stash: function(name, glob, opts) {
      this.cache[name] = mm(this.files, glob, opts);
      return this;
    },

    filter: function(fn) {
      this.files = this.files.filter(fn);
      return this;
    },

    flush: function() {
      this.files = [];
      return this;
    }
  });
};
