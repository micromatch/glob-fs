'use strict';

var dotfiles = require('../middleware/dotfiles');
var glob = require('..')({ gitignore: true })
  .use(dotfiles())


glob.readdirPromise('**/*')
  .then(function (files) {
    console.log(files.length);
  });
