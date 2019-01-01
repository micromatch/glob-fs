'use strict';

var should = require('should');
var Glob = require('..');
var path = require('path');
var orig = process.cwd();
var glob;

describe("slashes", function () {
  before(function () {
    process.chdir(__dirname + '/fixtures');
  });

  after(function () {
    process.chdir(orig);
  });
  var mm = require('micromatch');

  beforeEach(function () {
    glob = new Glob();

    glob.on('file', function (file) {
      // console.log(mm.isMatch(file.relative, 'a/*/*/*/**/'))
    });

    glob.on('read', function () {
      glob.files = [];
    });
  });

  it('should only return directories when the pattern ends in a slash:', function () {
    glob.readdirSync('a/*/').should.eql([ 'a/b/', 'a/bc/', 'a/c/' ]);
  });

  it('should recurse and return directories when the pattern ends in a slash:', function () {
    glob.readdirSync('a/*/*/*/**/').should.eql([
      'a/b/c/d/',
      'a/bc/e/f/',
      'a/c/d/e/',
      'a/c/d/e/f/',
      'a/c/d/e/f/g/',
      'a/c/d/e/f/g/h/',
      'a/c/d/e/f/h/',
      'a/c/d/e/f/i/'
    ]);
    glob.readdirSync('a/*/*/*/*/').should.eql([ 'a/c/d/e/f/' ]);
  });
});
