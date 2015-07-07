'use strict';

module.exports = function (options) {
  return function dotfiles(file) {
    if (/(^\.|\/\.)/.test(file.path)) {
      file.exclude = true;
    }
    return file;
  };
};
