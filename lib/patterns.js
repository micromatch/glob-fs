'use strict';

var Pattern = require('./pattern');

module.exports = function (app) {
  app.visit('mixin', {

    pattern: function(val, options) {
      var pattern = new Pattern(val, options);
      if (pattern.negated) {
        this.union('excludes', pattern, options);
      } else {
        this.union('includes', pattern, options);
      }
      return this;
    },

    include: function(val, options) {
      this.map('inclusion', val, options);
      return this;
    },

    exclude: function(val, options) {
      this.map('exclusion', val, options);
      return this;
    },

    inclusion: function(val, options) {
      this.union('includes', new Pattern(val, options));
      this.emit('include', val);
      return this;
    },

    exclusion: function(val, options) {
      this.union('excludes', new Pattern(val, options, true));
      this.emit('exclude', val);
      return this;
    },

    isIncluded: function(str) {
      var len = this.includes.length;
      while (len--) {
        var include = this.includes[len];
        if (include.re.test(str)) {
          return true;
        }
      }
    },

    isExcluded: function(str) {
      var len = this.excludes.length;
      while (len--) {
        var exclude = this.excludes[len];
        if (exclude.re.test(str)) {
          return true;
        }
      }
    }
  });
};
