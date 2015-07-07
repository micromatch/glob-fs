/*!
 * glob-fs-3 <https://github.com/jonschlinkert/glob-fs-3>
 *
 * Copyright (c) 2015 .
 * Licensed under the MIT license.
 */

'use strict';

/* deps:mocha */
var assert = require('assert');
var should = require('should');
var globFs3 = require('./');

describe('globFs3', function () {
  it('should:', function () {
    globFs3('a').should.eql({a: 'b'});
    globFs3('a').should.equal('a');
  });

  it('should throw an error:', function () {
    (function () {
      globFs3();
    }).should.throw('globFs3 expects valid arguments');
  });
});
