'use strict';

var should = require('should');
var Glob = require('..');
var path = require('path');
var orig = process.cwd();
var glob;

describe('cwd', function () {
  describe('sync', function () {
    before(function () {
      process.chdir(__dirname + '/fixtures');
    });

    after(function () {
      process.chdir(orig);
    });

    beforeEach(function () {
      glob = new Glob();
      glob.on('read', function () {
        glob.files = [];
      });
    });

    it('should use the given cwd:', function () {
      glob.readdirSync('**/d').should.eql([ 'a/b/c/d', 'a/c/d' ]);
      glob.readdirSync('**/d', { cwd: 'a' }).should.eql([ 'b/c/d', 'c/d' ]);
      glob.readdirSync('**/d', { cwd: 'a/b' }).should.containDeep([ 'c/d' ]);
      glob.readdirSync('**/d', { cwd: path.resolve('a') }).should.eql([ 'b/c/d', 'c/d' ]);
      glob.readdirSync('**/d', { cwd: path.resolve('a/b') }).should.eql([ 'c/d' ]);
      glob.readdirSync('**/d', { cwd: path.resolve('a/b/') }).should.containDeep([ 'c/d' ]);
      glob.readdirSync('**/d', { cwd: path.resolve('a/b/') }).should.eql([ 'c/d' ]);
      glob.readdirSync('**/d', { cwd: process.cwd() }).should.eql([ 'a/b/c/d', 'a/c/d' ]);
      glob.readdirSync('a/**/d', { cwd: process.cwd() }).should.eql([ 'a/b/c/d', 'a/c/d' ]);
      glob.readdirSync('assets/**/m*.css').should.eql(['assets/css/main.css']);
      glob.readdirSync('b/*.js').should.eql(['b/a.js', 'b/b.js', 'b/c.js', 'b/index.js']);
    });

    it('should get files in the immediate directory:', function () {
      glob.readdirSync('a/bc/*').should.eql([ 'a/bc/e' ]);
      glob.readdirSync('*/*', {cwd: 'a'}).should.eql(['a.txt', 'b', 'bc', 'c']);
    });
  });
});

describe('sync cwd', function () {
  it('should glob files from the given cwd', function () {
    glob.readdirSync('*.js', {cwd: 'test'}).should.containDeep(['test.js']);
    glob.readdirSync('*', {cwd: 'test/fixtures/a'}).should.eql(['a.txt', 'b', 'bc', 'c']);
  });
});

describe('glob parent', function () {
  it('should set the cwd to the glob parent:', function () {
    glob.readdirSync('test/*.js').should.containDeep(['test/test.js']);
    glob.readdirSync('test/fixtures/a/*').should.eql(['test/fixtures/a/a.txt', 'test/fixtures/a/b', 'test/fixtures/a/bc', 'test/fixtures/a/c']);
  });
});


describe('async', function () {
  before(function () {
    process.chdir(__dirname + '/fixtures');
  });

  after(function () {
    process.chdir(orig);
  });

  beforeEach(function () {
    glob = new Glob();
    glob.on('read', function () {
      glob.files = [];
    });
  });

  it('should use the given cwd:', function () {
    glob.readdirSync('**/d').should.eql([ 'a/b/c/d', 'a/c/d' ]);
    glob.readdirSync('**/d', { cwd: 'a' }).should.eql([ 'b/c/d', 'c/d' ]);
    glob.readdirSync('**/d', { cwd: 'a/b' }).should.containDeep([ 'c/d' ]);
    glob.readdirSync('**/d', { cwd: path.resolve('a') }).should.eql([ 'b/c/d', 'c/d' ]);
    glob.readdirSync('**/d', { cwd: path.resolve('a/b') }).should.eql([ 'c/d' ]);
    glob.readdirSync('**/d', { cwd: path.resolve('a/b/') }).should.containDeep([ 'c/d' ]);
    glob.readdirSync('**/d', { cwd: path.resolve('a/b/') }).should.eql([ 'c/d' ]);
    glob.readdirSync('**/d', { cwd: process.cwd() }).should.eql([ 'a/b/c/d', 'a/c/d' ]);
    glob.readdirSync('a/**/d', { cwd: process.cwd() }).should.eql([ 'a/b/c/d', 'a/c/d' ]);
    glob.readdirSync('assets/**/m*.css').should.eql(['assets/css/main.css']);
    glob.readdirSync('b/*.js').should.eql(['b/a.js', 'b/b.js', 'b/c.js', 'b/index.js']);
  });

  it('should get files in the immediate directory:', function () {
    glob.readdirSync('a/bc/*').should.eql([ 'a/bc/e' ]);
    glob.readdirSync('*/*', {cwd: 'a'}).should.eql(['a.txt', 'b', 'bc', 'c']);
  });
});
