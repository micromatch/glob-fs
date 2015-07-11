'use strict';

/* deps: mocha */
var should = require('should');
var Glob = require('..');
var path = require('path');
var orig = process.cwd();
var glob;

describe('basic globbing', function () {
  before(function () {
    process.chdir(__dirname + '/fixtures');
  });

  after(function () {
    process.chdir(orig);
  });

  beforeEach(function () {
    glob = new Glob({track: true});

    glob.on('read', function () {
      glob.files = [];
    });
  });

  it('should glob files in the specified directory:', function () {
    glob.readdirSync('less/*.less', { cwd: process.cwd() }).should.eql(['less/a.less', 'less/b.less', 'less/c.less']);
  });

  it('should glob files in a nested directory:', function () {
    glob.readdirSync('**/*.less').should.eql(['less/a.less', 'less/b.less', 'less/c.less']);
  });

  it('should use options.cwd', function () {
    glob.readdirSync('*.less', {cwd: 'less'}).should.eql(['a.less', 'b.less', 'c.less']);
  });

  it('should glob files in the immediate directory:', function () {
    glob.readdirSync('js/*.js').should.eql(['js/scripts.js', 'js/scripts.min.js']);
  });
});
