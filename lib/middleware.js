'use strict';

var gitignore = require('../middleware/gitignore');

/**
 * Default middleware
 */


module.exports = function (app) {
  app.use(gitignore(app.options));
};
