'use strict';

var gitignore = require('../middleware/gitignore');
var unignore = require('../middleware/unignore');
var dotfiles = require('../middleware/dotfiles');
var isnt = require('../middleware/isnt');
// var glob = require('..')({ gitignore: false, ignore: 'node_modules' })
var glob = require('..')({ gitignore: true, track: true })

glob
  .exclude('*.css')
  .exclude('*.js')
  .exclude('*.yml');
// glob.exclude('*.js', {matchBase: true});
// var mini = require('minimatch');

glob
  .use(gitignore())
  .use(dotfiles({dotfile: true}))

var globFiles = [];
console.time('glob');

glob.readdirStream('**/*.*')
  .on('data', function (file) {
    console.log(file.path)
    // file = new Vinyl(file)
    // console.log(file)
    // globFiles.push(file);
    // if (globFiles.length % 100 === 0) {
    //   console.log('glob', globFiles.length);
    // }
  })
  .on('error', console.error)
  .on('end', function () {
    console.timeEnd('glob')
    // console.log(globFiles.length);

    // var files = [];
    // var gulp = require('gulp');
    // console.time('gulp');
    // gulp.src('**/*', {read: false})
    //   .on('data', function (file) {
    //     files.push(file);
    //     if (files.length % 100 === 0) {
    //       console.log('gulp', files.length);
    //     }
    //   })
    //   .on('error', console.error)
    //   .on('end', function () {
    //     console.timeEnd('gulp');
    //     console.log(files.length);
    //   });
  });


// console.time('glob')
// glob.readdirStream('**/*', function (err, files) {
//   console.timeEnd('glob')
//   if (err) return console.error(err);
//   console.log(this.files.length);

//   var globby = require('globby');
//   console.time('globby');
//   globby('**/*', function (err, files) {
//     console.timeEnd('globby');
//     if (err) return console.error(err);
//     console.log(files.length);
//   });
// });





