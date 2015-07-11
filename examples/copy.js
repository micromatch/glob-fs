

var through = require('through2');
var glob = require('./')({ gitignore: true, dot: true })
  // .filter('data', function (file) {
  //   // console.log(file.relative);
  // })


glob.readdirStream('*.*')
  .pipe(through.obj(function (file, enc, cb) {
    this.push(file);
    cb();
  }))
  .on('data', function (file) {
    // console.log(file.relative);
  })
