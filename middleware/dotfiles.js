'use strict';

var extend = require('extend-shallow');
var isDotfile = require('is-dotfile');
var isDotdir = require('is-dotdir');

module.exports = function (options) {
  var config;

  return function dotfiles(file, opts) {
    var opts = config || (config = extend({}, this.options, options));
    if (opts.dot === true) {
      return file;
    }

    if (isDotdir(file.path)) {
      if (opts.dotdir === true) {
        return file;
      }
      file.exclude = true;
    }

    if (isDotfile(file.path)) {
      if (opts.dotfile === true || opts.dotdir === true) {
        return file;
      }
      file.exclude = true;
    }
    return file;
  };
};
