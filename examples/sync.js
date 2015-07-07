'use strict';

var gitignore = require('../middleware/gitignore');
var unignore = require('../middleware/unignore');
var dotfiles = require('../middleware/dotfiles');
var isnt = require('../middleware/isnt');
// var glob = require('..')({ gitignore: false, ignore: 'node_modules' })
var glob = require('..')({ gitignore: true, track: true, dot: true })
  // .use(require('foo'))
  // .use(require('bar'))

// glob.exclude('*.txt', {matchBase: true});
// glob.exclude('*.js', {matchBase: true});
// var mini = require('minimatch');

// glob.on('file', function (file) {
//   console.log('file', file.path)
// });

glob.on('exclude', function (file) {
  // if (/\.git(\/|$)/.test(file.path)) {
  //   glob.files.push(file.path);
  // }
  // console.log('excluded:', file.path)
});

glob.on('include', function (file) {
  // console.log('included:', file)
});

glob
  .use(dotfiles())
  .use(gitignore())
  .use(isnt(/^node_modules/))
  .use(unignore(/\.gitignore/))


console.time('glob')
var res = glob.readdirSync('**/*.js');
  // .get('**/stream.js')

console.timeEnd('glob')
console.log(res);

// var globby = require('globby');
// console.time('globby');
// var globbies = globby.sync('**/*');
// console.timeEnd('globby');
// console.log(globbies.length);
// // console.log(globbies);

