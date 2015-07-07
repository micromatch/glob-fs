'use strict';

module.exports = function (app) {
  app.visit('mixin', {

    readdir: function(pattern, options, cb) {
      if (typeof options === 'function') {
        return this.readdir(pattern, {}, options);
      }

      this.setPattern(pattern, options);
      this.iteratorAsync(this.pattern.base, function (err) {
        if (err) return cb(err);

        cb.call(this, null, this.files);
      }.bind(this));
    },

    readdirSync: function(pattern, options) {
      this.setPattern(pattern, options);
      this.iteratorSync(this.pattern.base);
      return this;
    },

    readdirStream: function(pattern, options) {
      this.setPattern(pattern, options);
      return this.iteratorStream(this.pattern.base);
    },

    readdirPromise: function(pattern, options) {
      this.setPattern(pattern, options);
      return this.iteratorPromise(this.pattern.base);
    }
  });
};
