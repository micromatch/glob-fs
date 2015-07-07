'use strict';

var dotfiles = require('../middleware/dotfiles');
var glob = require('..');


glob({ gitignore: false })
  .exclude('node_modules')
  .use(dotfiles())
  .readdir('**/*.js', function (err, files) {
    if (err) return console.error(err);
    console.log(files.length);
  });
