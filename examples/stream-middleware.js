'use strict';

var dotfiles = require('../middleware/dotfiles');
var glob = require('..');
var files = [];


// init, load some random middleware
var glob = glob({ gitignore: true })
  .exclude('*.css')
  .exclude('*.js')
  .exclude('*.yml')
  .use(dotfiles())


// get files
glob.readdirStream('**/*')
  .on('data', function (file) {
    files.push(file.path);
  })
  .on('error', console.error)
  .on('end', function () {
    console.log('total files:', files.length);
  });
