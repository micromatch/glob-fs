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

  beforeEach(function () {
    glob = new Glob();

    glob.on('data', function (file) {
      // console.log(file.path);
    });

    glob.on('read', function () {
      glob.files = [];
    });
  });

  it('should only return directories when the pattern ends in a slash:', function () {
    glob.readdirSync('a/**/').should.eql([ 'a/b/c/d', 'a/c/d' ]);
  });
});
