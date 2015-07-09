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

  describe('gitignore', function () {
    describe('when a user has `node_modules` defined in `.gitignore`', function () {
      it.skip('should recurse into node_modules by default:', function () {
        glob.readdirSync('**').should.containDeep(['node_modules']);
      });

      it('should not recurse into node_modules when `options.gitignore` is true:', function () {
        glob.readdirSync('*', {gitignore: true}).should.not.containDeep(['node_modules']);
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
