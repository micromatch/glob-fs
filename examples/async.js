'use strict';

var gitignore = require('../middleware/gitignore');
var exclude = require('../middleware/exclude');
var unignore = require('../middleware/unignore');
var dotfiles = require('../middleware/dotfiles');
var isnt = require('../middleware/isnt');
var glob = require('..')({ gitignore: false })
  // .use(gitignore())
  // .use(dotfiles())
  // .use(function (file) {
  //   if (/fff/.test(file.path)) {
  //   console.log(file.path)
  //     file.include = true;
  //   }
  //   return file;
  // })
  // .use(isnt(/^node_modules/))
  // .use(unignore(/\.gitignore/))
  // .use(exclude('*.js'))
  // .use(exclude('*.json'))
  // .use(exclude('*.md'))

// var glob = require('..')({ gitignore: false, ignore: 'node_modules' })

// glob.ignore('*.txt', {matchBase: true});
glob.exclude('node_modules', {matchBase: true});
// glob.exclude('*.md', {matchBase: true});
// var mini = require('minimatch');


console.time('glob')
glob.readdir('**/*.js', function (err, files) {
  if (err) return console.error(err);
  console.log(files.length);
  console.timeEnd('glob')

  var globby = require('globby');
  console.time('globby');
  globby('**/*.js', function (err, files) {
    if (err) return console.error(err);
    console.log(files.length);
    console.timeEnd('globby');
  });
});

