'use strict';

var should = require('should');
var Glob = require('..');
var path = require('path');
var orig = process.cwd();
var gitignore = require('glob-fs-gitignore');
var glob;

describe("changing cwd and searching for **/d", function () {
  beforeEach(function () {
    glob = new Glob();
  });

  describe('gitignore', function () {
    describe('when a user has `node_modules` defined in `.gitignore`', function () {
      it.skip('should recurse into node_modules by default:', function () {
        glob.readdirSync('**').should.containDeep(['node_modules']);
      });

      it.skip('should not recurse into node_modules when `options.gitignore` is true:', function () {
        var files = glob = new Glob({gitignore: false})
          .use(gitignore())
          .readdirSync('*');

        files.should.not.containDeep(['node_modules']);
      });

      it('should recurse into node_modules when it\'s specified in the glob pattern:', function () {
        glob.readdirSync('./node_modules/micromatch/*.js').should.containDeep(['node_modules/micromatch/index.js']);
      });

      it('should read parent directories:', function () {
        // cwd is `test/fixtures`
        glob.readdirSync('../../*.js', {cwd: 'test/fixtures'}).should.containDeep(['../../index.js']);
        glob.readdirSync('../**/*.js', {cwd: 'test/fixtures'}).should.containDeep(['b/a.js', '../cwd.js']);
      });
    });
  });
});
