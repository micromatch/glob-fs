'use strict';

// function any(fp, patterns, options) {
//   options = options || {};
//   var res = {is: [], isnt: []};
//   res.file = fp;
//   var len = patterns.length;
//   var i = -1;

//   while (++i < len) {
//     var pattern = patterns[i];
//     if (mm.isMatch(fp, pattern, {dot: true, contains: true})) {
//       res.is.push(pattern);
//       break;
//     } else {
//       res.isnt.push(pattern);
//     }
//   }
//   return res;
// }

// var ignored = gitignore('.gitignore');

// console.log(any('node_modules', ignored));
// console.log(any('test', ignored));
// console.log(any('.DS_Store', ignored));
// console.log(any('test/actual/foo.js', ignored));
