'use strict';

var should = require('should');
var Glob = require('..');
var orig = process.cwd();
var glob;

describe('globstar', function() {
  before(function() {
    process.chdir(__dirname + '/fixtures');
  });

  after(function() {
    process.chdir(orig);
  });

  beforeEach(function() {
    glob = new Glob();
    glob.on('read', function() {
      glob.files = [];
    });
  });

  it('should not return duplicate files:', function() {
    glob.readdirSync('a/**/[gh]').should.eql([ 'a/c/d/e/f/g', 'a/c/d/e/f/g/h', 'a/c/d/e/f/h' ]);
  });
});
