'use strict';

var should = require('should');
var Glob = require('..');
var path = require('path');
var orig = process.cwd();
var glob;

describe('root', function() {
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

  it.skip('root', function() {
    glob.readdirSync('/b*/**', { root: '.' }).should.eql(['b.js']);
    glob.readdirSync('/b*/**', { root: path.resolve('a') }).should.eql(['/b', '/b/c', '/b/c/d', '/bc', '/bc/e', '/bc/e/f']);
    glob.readdirSync('/b*/**', { root: 'a', cwd: path.resolve('a/b') }).should.eql([ '/b', '/b/c', '/b/c/d', '/bc', '/bc/e', '/bc/e/f' ]);
  });
});
