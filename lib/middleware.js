'use strict';

/**
 * Built-in middleware
 */

module.exports = function (app, glob, options) {
  var opts = app.options || {};

  if (opts.builtins !== false) {

    // turned `on` by default
    if (opts.dotfiles !== false) {
      app.use(require('glob-fs-dotfiles')(opts));
    }

    // turned `off` by default
    if (opts.gitignore !== true) {
      app.use(require('glob-fs-gitignore')(opts));
    }
  }

  app.include(glob, options);
};
