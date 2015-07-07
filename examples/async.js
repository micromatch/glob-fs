'use strict';

var glob = new Glob({ gitignore: false });
var fns = require('./asyncFns');

// glob.ignore('*.txt', {matchBase: true});
// glob.ignore('*.js', {matchBase: true});
// var mini = require('minimatch');

glob
  .use(fns.gitignore())
  .use(function (file, options, next) {
    if (/(^\.|\/\.)/.test(file.path)) {
      file.ignore = true;
      return next()
    }
    next(null, file);
  })
  .use(function (file, options, next) {
    file.isMatch = mm.isMatch(file.path, this.pattern.glob);
    next(null, file);
  });


console.time('glob')
glob.readdir('**/*', function (err, files) {
  console.timeEnd('glob')
  if (err) return console.error(err);
  console.log(this.files.length);

  var globby = require('globby');
  console.time('globby');
  globby('**/*', function (err, files) {
    console.timeEnd('globby');
    if (err) return console.error(err);
    console.log(files.length);
  });
});

