'use strict';

var gitignore = require('../middleware/gitignore');
var dotfiles = require('../middleware/dotfiles');
var files = [];

var glob = require('..')({ gitignore: true, track: true })
  .exclude('*.css')
  .exclude('*.js')
  .exclude('*.yml')
  .use(dotfiles())
  .use(gitignore());


glob.readdirStream('**/*')
  .on('data', function (file) {
    console.log(file);
    files.push(file);
  })
  .on('error', console.error)
  .on('end', function () {
    console.log(files.length);
  });
