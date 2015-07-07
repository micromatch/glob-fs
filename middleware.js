'use strict';

var fs = require('fs');
var isGlob = require('is-glob');
var extend = require('extend-shallow');
var ignore = require('parse-gitignore');
var mm = require('micromatch');
var mini = require('minimatch');
var cache = {};


function gitignore(fp) {
  if (cache[fp]) return cache[fp];
  if (!fs.existsSync(fp)) return [];
  var str = fs.readFileSync(fp, 'utf8');
  return (cache[fp] = ignore(str));
}

exports.gitignore = function (options) {
  var ignored = gitignore('.gitignore');
  var isMatch = mm.matcher(ignored.join('|'), {contains: true});

  return function (file, opts) {
    opts = extend({}, options, opts);
    if (opts.gitignore === false) return file;
    if (isMatch(file.path)) {
      file.exclude = true;
    }
    return file;
  };
};

// exports.gitignore = function (options) {
//   options = options || {};

//   var ignored = gitignore('.gitignore');
//   var len = ignored.length;

//   return function (file) {
//     var i = -1;
//     while (++i < len) {
//       if (mm.isMatch(file.path, ignored[i])) {
//         file.ignore = true;
//         break;
//       }
//     }
//     return file;
//   };
// };

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
