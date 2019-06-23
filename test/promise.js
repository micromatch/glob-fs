'use strict';

var should = require('should');
var Glob = require('..');
var path = require('path');
var orig = process.cwd();
var glob;

describe("promise", function () {
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
    return glob.readdirPromise('a/*/').then(function(files) {
      (files.length).should.eql(3);
      (files.includes('a/b/')).should.eql(true);
      (files.includes('a/c/')).should.eql(true);
      (files.includes('a/bc/')).should.eql(true);
    });
  });

  it('should not resolve with excluded matches:', function () {
    function exclude(file) {
      file.exclude = (file.path.indexOf('bc') === -1);
      return file;
    }

    return glob.use(exclude).readdirPromise('a/*/').then(function(files) {
      (files.length).should.eql(1);
      (files.includes('a/bc/')).should.eql(true);
    });
  });

  it('should only return files that match and not the directories containing them:', function () {
    return glob.readdirPromise('a/bc/e/f/*').then(function(files) {
      (files.length).should.eql(1);
      (files.includes('a/bc/e/f/fff.js')).should.eql(true);
    });
  });

  it('should emit the correct values when completed:', function () {
    var emittedFiles = [];
    glob.on('end', function(files) {
      emittedFiles = files;
    });

    return glob.readdirPromise('a/bc/e/f/*').then(function(files) {
      (emittedFiles.length).should.eql(1);
      (emittedFiles.includes('a/bc/e/f/fff.js')).should.eql(true);
    });
  });
});
