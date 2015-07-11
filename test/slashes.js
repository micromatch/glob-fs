'use strict';

var should = require('should');
var Glob = require('..');
var path = require('path');
var orig = process.cwd();
var glob;

describe("root", function () {
  before(function () {
    process.chdir(__dirname + '/fixtures');
  });

  after(function () {
    process.chdir(orig);
  });
  var mm = require('micromatch');

  beforeEach(function () {
    glob = new Glob();

    // glob.on('file', function (file) {
      // console.log(mm.isMatch(file.relative, 'a/*/*/*/**/'))
    // });

    glob.on('include', function (file) {
      // console.log(file.relative)
      if (file.pattern.endsWith('/') && !file.endsWith('/')) {
        file.relative += '/';
      }
    });

    glob.on('read', function () {
      glob.files = [];
    });
  });

  it('should only return directories when the pattern ends in a slash:', function () {
    // glob.readdirSync('a/*/').should.eql([ 'a/b/', 'a/bc/', 'a/c/' ]);
  });

  it('should recurse and return directories when the pattern ends in a slash:', function (done) {
    // glob.readdirSync('a/*/*/*/*/').should.eql([ 'a/c/d/e/f/' ]);
    // glob.readdirSync('a/*/*/*/**/').should.eql([ 'a/c/d/e/f/' ]);
    var files = [];
    console.time('glob');
    glob.readdirStream('a/*/*/*/**/')
      .on('data', function (file) {
        files.push(file.relative);
      })
      .on('end', function () {
        console.log('glob:', files);
        console.timeEnd('glob');

        console.time('globby');
        var globby = require('globby');
        globby('a/*/*/*/**/', function (err, files) {
          console.log('globby:', files);
          console.timeEnd('globby');
          done();
        });
      });

    // console.log(globby.sync('a/*/'))
  });
});
// a/b/c/d