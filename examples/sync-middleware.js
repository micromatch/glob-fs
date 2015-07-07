'use strict';

var fn = require('../middleware');
var glob = require('..');


var files = glob()
  .use(fn.dotfiles())
  .use(fn.isnt(/^node_modules/))
  .use(fn.unignore(/\.gitignore/))
  .readdirSync('**/*.js');

console.log(files);
