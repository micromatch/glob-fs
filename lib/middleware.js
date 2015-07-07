'use strict';

var gitignore = require('glob-fs-gitignore');
var dotfiles = require('glob-fs-dotfiles');

/**
 * Built-in middleware
 */

module.exports = function (app) {
  if (app.options.builtins !== false) {
    app.use(gitignore(app.options));
    app.use(dotfiles(app.options));
  }
};
