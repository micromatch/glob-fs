
console.time('glob');
var glob = require('./')();

var files = [];
glob.readdir('**', function (err, files) {
  // console.log(files);
  console.timeEnd('glob');
});

// console.time('globby');
// var globby = require('globby');
// globby('**', function (err, files) {
//   console.log('globby:', files);
//   console.timeEnd('globby');
// });
