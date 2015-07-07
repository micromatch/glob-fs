'use strict';

var mm = require('micromatch');
// var glob = require('..')({ gitignore: false, ignore: 'node_modules' })
var glob = require('..')({ gitignore: false })
  // .use(require('foo'))
  // .use(require('bar'))

// glob.exclude('*.txt', {matchBase: true});
// glob.exclude('*.js', {matchBase: true});
var middleware = require('../middleware');
// var mini = require('minimatch');

// glob.on('file', function (file) {
//   console.log('file', file.path)
// });

// glob.on('exclude', function (file) {
//   if (/glob\.js/.test(file.path)) {
//     file.exclude = false;
//   }
//   console.log('exclude', file.path)
// });

// glob
//   .use(middleware.gitignore())
//   .use(function (file) {
//     if (/^node_modules/.test(file.path)) {
//       file.exclude = true;
//     }
//     return file;
//   })


console.time('glob')
glob.readdirSync('**/*.js');
console.timeEnd('glob')
console.log(glob.list);

// var globby = require('globby');
// console.time('globby');
// var globbies = globby.sync('**/*');
// console.timeEnd('globby');
// console.log(globbies.length);
// // console.log(globbies);

