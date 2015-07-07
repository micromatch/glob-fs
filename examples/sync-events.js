'use strict';

var unignore = require('../middleware/unignore');
var dotfiles = require('../middleware/dotfiles');
var isnt = require('../middleware/isnt');
var i = {includes: 0, excludes: 0};


var glob = require('..')({ gitignore: true })
  .use(isnt(/^node_modules/))
  .use(unignore(/\.gitignore/))
  .use(dotfiles())
  .use(function (file) {
    if (/\.js$/.test(file.path)) {
      this.emit('js', file);
    }
    return file;
  });


glob.on('js', function (file) {
  console.log('js file:', file.path);
});

glob.on('exclude', function (file) {
  console.log('excluded:', i.excludes++);
});

glob.on('include', function (file) {
  // console.log(file.path);
  console.log('included:', i.includes++);
});

glob.on('end', function () {
  console.log('total files:', this.files.length);
});

glob.readdirSync('**/*.js');
