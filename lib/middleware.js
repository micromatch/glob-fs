'use strict';

var lazy = require('lazy-cache')(require);
var gitignore = lazy('glob-fs-gitignore');
var dotfiles = lazy('glob-fs-dotfiles');

/**
 * Built-in middleware
 */

module.exports = function (app) {
  var opts = app.options;

  if (opts.builtins !== false) {

    // turned `on` by default
    if (opts.dotfiles !== false) {
      app.use(dotfiles()(opts));
    }

    // turned `off` by default
    if (opts.gitignore === true) {
      app.use(gitignore()(opts));
    }
  }
};
