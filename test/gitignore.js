'use strict';

var should = require('should');
var Glob = require('..');
var path = require('path');
var orig = process.cwd();
var gitignore = require('glob-fs-gitignore');
var glob;

describe('gitignore', function () {
  beforeEach(function () {
    glob = new Glob();
  });

  describe('sync', function () {
    describe('when a user has `node_modules` defined in `.gitignore`', function () {
      it('should recurse into node_modules when built-ins are disabled:', function () {
        glob = new Glob({builtins: false});
        glob.readdirSync('**').should.containDeep(['node_modules']);
      });

      it('should not recurse into node_modules when `options.gitignore` is true:', function () {
        var files = glob = new Glob({gitignore: false})
          .use(gitignore())
          .readdirSync('*');
        files.should.not.containDeep(['node_modules']);
      });

      it('should recurse into node_modules when it\'s specified in the glob pattern:', function () {
        glob = new Glob({ gitignore: false })
        glob.readdirSync('./node_modules/micromatch/*.js').should.containDeep(['node_modules/micromatch/index.js']);
      });

      it('should read parent directories:', function () {
        // cwd is `test/fixtures`
        glob.readdirSync('../../*.js', {cwd: 'test/fixtures'}).should.containDeep(['../../index.js']);
        glob.readdirSync('../**/*.js', {cwd: 'test/fixtures'}).should.containDeep(['../cwd.js']);
      });
    });
  });
});
