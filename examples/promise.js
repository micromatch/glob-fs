'use strict';

var unignore = require('../middleware/unignore');
var dotfiles = require('../middleware/dotfiles');
var isnt = require('../middleware/isnt');
var glob = require('..')({ gitignore: true });
var files = [];

glob.readdirStream('**/*')
  .on('data', function (file) {
    console.log(file.path);
    files.push(file);
  })
  .on('error', console.error)
  .on('end', function () {
    console.log('total files:', files.length);
  });

