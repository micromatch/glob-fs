'use strict';

var should = require('should');
var Glob = require('..');
var path = require('path');
var orig = process.cwd();
var glob;

describe("changing cwd and searching for **/d", function () {
  beforeEach(function () {
    glob = new Glob();

    glob.on('file', function (file) {
      // console.log(this)
    });

    glob.on('read', function () {
      glob.files = [];
    });
  });


  describe('sync:dotfiles', function () {
    it('should not return dotfiles or directories by default:', function () {
      glob.readdirSync('*').should.containDeep(['LICENSE', 'README.md']);
      glob.readdirSync('*').should.not.containDeep(['.editorconfig', '.git']);
    });

    it('should return dotfiles and dotdirs when the pattern has a leading dot:', function () {
      glob.readdirSync('.*').should.containDeep(['.git', '.gitignore']);
    });

    it('should return dotfiles from a given cwd', function () {
      glob.readdirSync('.*', {cwd: 'test/fixtures', dotfiles: true}).should.containDeep(['.dotfile']);
      glob.readdirSync('fixtures/.*', {cwd: 'test', dotfiles: true}).should.containDeep(['fixtures/.dotfile']);
      glob.readdirSync('fixtures/a/b/.*', {cwd: 'test', dotfiles: true}).should.containDeep(['fixtures/a/b/.dotfile']);
      glob.readdirSync('a/b/.*', {cwd: 'test/fixtures', dotfiles: true}).should.containDeep(['a/b/.dotfile']);
      glob.readdirSync('**/.*', {cwd: 'test/fixtures', dotfiles: true}).should.containDeep(['.dotfile']);
    });

    it('should return dotfiles and directories when `dot` is true:', function () {
      glob.readdirSync('.*', { dot: true }).should.containDeep(['.editorconfig', '.git', '.gitattributes', '.gitignore', '.jshintrc', '.verb.md']);
    });

    it('should return dotfiles when `dotfiles` is true:', function () {
      glob.readdirSync('.*', { dotfiles: true }).should.containDeep(['.editorconfig', '.gitattributes', '.gitignore', '.jshintrc', '.verb.md']);
    });

    it('should return dotdirs when `dotdirs` is true:', function () {
      glob = new Glob({ dotdirs: true });
      glob.readdirSync('.*', { dotdirs: true }).should.containDeep(['.git']);
    });

    it('should return dotdirs when `dotdirs` is defined globally:', function () {
      glob = new Glob({ dotfiles: true });
      glob.readdirSync('.*').should.containDeep(['.editorconfig', '.gitattributes']);
      glob.readdirSync('*').should.containDeep(['.gitignore']);
    });

    it('should return dotdirs when `dotdirs` is defined on a read method:', function () {
      glob.readdirSync('.*', { dotfiles: true }).should.containDeep(['.editorconfig', '.gitattributes']);
      glob.readdirSync('*', { dotfiles: true }).should.containDeep(['.gitignore']);
    });
  });
});


