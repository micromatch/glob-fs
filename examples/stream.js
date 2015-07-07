

/**
 * STREAM EXAMPLE
 * --------------------------------
 */

var glob = new Glob({ gitignore: false });
var fns = require('../middleware/gitignore');
// var Vinyl = require('vinyl');

// glob.exclude('*.txt', {matchBase: true});
// glob.exclude('*.js', {matchBase: true});
// var mini = require('minimatch');

glob
  .use(fns.gitignore())
  .use(fns.dotfiles())
  .use(function (file, options, next) {
    file.isMatch = mm.isMatch(file.path, this.pattern.glob);
    next(null, file);
  })

var globFiles = [];
console.time('glob');

glob.readdirStream('**/*')
  .on('data', function (file) {
    // file = new Vinyl(file)
    // console.log(file)
    globFiles.push(file);
    if (globFiles.length % 100 === 0) {
      console.log('glob', globFiles.length);
    }
  })
  .on('error', console.error)
  .on('end', function () {
    console.timeEnd('glob')
    console.log(globFiles.length);

    var files = [];
    var gulp = require('gulp');
    console.time('gulp');
    gulp.src('**/*', {read: false})
      .on('data', function (file) {
        files.push(file);
        if (files.length % 100 === 0) {
          console.log('gulp', files.length);
        }
      })
      .on('error', console.error)
      .on('end', function () {
        console.timeEnd('gulp');
        console.log(files.length);
      });
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





