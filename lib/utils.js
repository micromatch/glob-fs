'use strict';

var fs = require('fs');

/**
 * Utils
 */

var utils = module.exports;

/**
 * Cast `val` to an array.
 *
 * @param  {String|Array} `val`
 * @return {Array}
 */

utils.arrayify = function arrayify(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Concatenate and flatten multiple arrays, filtering
 * falsey values from the result set.
 *
 * @param {Array} `arrays` One or more arrays
 * @return {Array}
 */

utils.union = function union() {
  var arr = [].concat.apply([], [].slice.call(arguments));
  return utils.flatten(arr).filter(Boolean);
};

/**
 * File system utils.
 */

utils.tryRead = function tryRead(fp) {
  try {
    return fs.readFileSync(fp, 'utf8');
  } catch (err) {
    return null;
  }
};

utils.tryReaddir = function tryReaddir(dir) {
  try {
    return fs.readdirSync(dir);
  } catch(err) {}
  return [];
};

utils.tryStat = function tryStat(fp) {
  try {
    return fs.statSync(fp);
  } catch(err) {}
  return null;
};

utils.reduce = function reduce(arr, cb, thisArg) {
  var len = arr.length;
  var res = [];
  if (!len) return [];
  for (var i = 0; i < len; i++) {
    res = cb.call(thisArg, res, arr[i], i, arr);
  }
  return res || [];
};
