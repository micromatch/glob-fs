'use strict';

require('mocha');
var should = require('should');
var Glob = require('..');
var path = require('path');
var orig = process.cwd();
var glob;

describe('cwd', function() {
  describe('sync', function() {
    before(function() {
      process.chdir(__dirname + '/fixtures');
    });

    after(function() {
      process.chdir(orig);
    });

    beforeEach(function() {
      glob = new Glob();
      glob.on('file', function(file) {
        // console.log(file.relative)
      });
      glob.on('read', function() {
        glob.files = [];
      });
    });

    it('should use the given cwd:', function() {
      glob.readdirSync('**/d').should.containDeep([ 'a/b/c/d', 'a/c/d' ]);
      glob.readdirSync('**/d', { cwd: 'a' }).should.containDeep([ 'b/c/d', 'c/d' ]);
      glob.readdirSync('**/d', { cwd: 'a/b' }).should.containDeep([ 'c/d' ]);
      glob.readdirSync('**/d', { cwd: path.resolve('a') }).should.containDeep([ 'b/c/d', 'c/d' ]);
      glob.readdirSync('**/d', { cwd: path.resolve('a/b') }).should.containDeep([ 'c/d' ]);
      glob.readdirSync('**/d', { cwd: path.resolve('a/b/') }).should.containDeep([ 'c/d' ]);
      glob.readdirSync('**/d', { cwd: path.resolve('a/b/') }).should.containDeep([ 'c/d' ]);
      glob.readdirSync('**/d', { cwd: process.cwd() }).should.containDeep([ 'a/b/c/d', 'a/c/d' ]);
      glob.readdirSync('a/**/d', { cwd: process.cwd() }).should.containDeep([ 'a/b/c/d', 'a/c/d' ]);
      glob.readdirSync('assets/**/m*.css').should.containDeep(['assets/css/main.css']);
      glob.readdirSync('b/*.js').should.containDeep(['b/a.js', 'b/b.js', 'b/c.js', 'b/index.js']);
    });

    it('should get files in the immediate directory:', function() {
      glob.readdirSync('a/bc/*').should.containDeep([ 'a/bc/e' ]);
      glob.readdirSync('*/*', {cwd: 'a'}).should.containDeep(['a.txt', 'b', 'bc', 'c']);
    });
  });

  describe('sync cwd', function() {
    glob = new Glob();

    it('should glob files from the given cwd', function() {
      glob.readdirSync('*.js', {cwd: 'test'}).should.containDeep(['test.js']);
      glob.readdirSync('*', {cwd: 'test/fixtures/a'}).should.containDeep(['a.txt', 'b', 'bc', 'c']);
    });
  });

  describe('glob parent', function() {
    glob = new Glob();

    it('should set the cwd to the glob parent:', function() {
      glob.readdirSync('test/*.js').should.containDeep(['test/test.js']);
      glob.readdirSync('test/fixtures/a/*').should.containDeep(['test/fixtures/a/a.txt', 'test/fixtures/a/b', 'test/fixtures/a/bc', 'test/fixtures/a/c']);
    });
  });
});

describe('async', function() {
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

  it('', function(done) {
    glob.readdir('**/d', function(err, files) {
      if (err) return done(err);
      files.should.containDeep([ 'a/b/c/d', 'a/c/d' ]);
      done();
    });
  });
  it('', function(done) {
    glob.readdir('**/d', { cwd: 'a' }, function(err, files) {
      if (err) return done(err);
      files.should.containDeep([ 'b/c/d', 'c/d' ]);
      done();
    });
  });
  it('', function(done) {
    glob.readdir('**/d', { cwd: 'a/b' }, function(err, files) {
      if (err) return done(err);
      files.should.containDeep([ 'c/d' ]);
      done();
    });
  });
  it('', function(done) {
    glob.readdir('**/d', { cwd: path.resolve('a') }, function(err, files) {
      if (err) return done(err);
      files.should.containDeep([ 'c/d', 'b/c/d' ]);
      done();
    });
  });
  it('', function(done) {
    glob.readdir('**/d', { cwd: path.resolve('a/b') }, function(err, files) {
      if (err) return done(err);
      files.should.containDeep([ 'c/d' ]);
      done();
    });
  });
  it('', function(done) {
    glob.readdir('**/d', { cwd: path.resolve('a/b/') }, function(err, files) {
      if (err) return done(err);
      files.should.containDeep([ 'c/d' ]);
      done();
    });
  });
  it('', function(done) {
    glob.readdir('**/d', { cwd: path.resolve('a/b/') }, function(err, files) {
      if (err) return done(err);
      files.should.containDeep([ 'c/d' ]);
      done();
    });
  });
  it('', function(done) {
    glob.readdir('**/d', { cwd: process.cwd() }, function(err, files) {
      if (err) return done(err);
      files.should.containDeep([ 'a/c/d', 'a/b/c/d' ]);
      done();
    });
  });
  it('', function(done) {
    glob.readdir('a/**/d', { cwd: process.cwd() }, function(err, files) {
      if (err) return done(err);
      files.should.containDeep([ 'a/c/d', 'a/b/c/d' ]);
      done();
    });
  });
  it('', function(done) {
    glob.readdir('assets/**/m*.css', function(err, files) {
      if (err) return done(err);
      files.should.containDeep(['assets/css/main.css']);
      done();
    });
  });
  it('', function(done) {
    glob.readdir('b/*.js', function(err, files) {
      if (err) return done(err);
      files.should.containDeep(['b/a.js', 'b/b.js', 'b/c.js', 'b/index.js']);
      done();
    });
  });

  it('should get files in the immediate directory:', function(done) {
    glob.readdir('*/*', {cwd: 'a'}, function(err, files) {
      files.should.containDeep(['a.txt', 'b', 'bc', 'c']);
      done();
    });
  });
});
