'use strict';

var dotfiles = require('../middleware/dotfiles');
var glob = require('..');

glob({ gitignore: false })
  .exclude('node_modules')
  .exclude('*.js')
  .exclude('*.css')
  .use(dotfiles())
  .readdir('**/*', function (err, files) {
    if (err) return console.error(err);
    console.log(files.length);
  });

