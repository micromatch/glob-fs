'use strict';

var should = require('should');
var Glob = require('..');
var path = require('path');
var orig = process.cwd();
var glob;

describe("changing cwd and searching for **/d", function() {
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

  it('cwd', function() {
    // glob.handler.once('gitignore', function(file) {
    //   console.log(file.path);
    // });

    glob.readdirSync('**/d').should.eql([ 'a/b/c/d', 'a/c/d' ]);
    glob.readdirSync('**/d', { cwd: path.resolve('a') }).should.eql([ 'b/c/d', 'c/d' ]);
    glob.readdirSync('**/d', { cwd: path.resolve('a/b') }).should.eql([ 'c/d' ]);
    glob.readdirSync('**/d', { cwd: path.resolve('a/b/') }).should.eql([ 'c/d' ]);
    glob.readdirSync('**/d', { cwd: process.cwd() }).should.eql([ 'a/b/c/d', 'a/c/d' ]);
  });

});
